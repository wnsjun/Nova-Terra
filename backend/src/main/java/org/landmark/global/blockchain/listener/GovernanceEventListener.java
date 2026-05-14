package org.landmark.global.blockchain.listener;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.governance.service.GovernanceService;
import org.landmark.domain.properties.repository.PropertyRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.EthLog;
import org.web3j.protocol.core.methods.response.Transaction;

/**
 * DAO 컨트랙트의 ProposalCreated / Voted 이벤트를 HTTP 폴링으로 감지해서 DB에 반영.
 * 30초마다 실행, lastProcessedBlock 기준으로 중복 처리 없음.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GovernanceEventListener {

    private static final Event PROPOSAL_CREATED_EVENT = new Event(
            "ProposalCreated",
            Arrays.asList(
                    new TypeReference<Uint256>(true) {},   // indexed proposalId
                    new TypeReference<Utf8String>(false) {}// description
            )
    );

    private static final Event VOTED_EVENT = new Event(
            "Voted",
            Arrays.asList(
                    new TypeReference<Uint256>(true) {},   // indexed proposalId
                    new TypeReference<Address>(false) {},  // voter
                    new TypeReference<Bool>(false) {},     // support
                    new TypeReference<Uint256>(false) {}   // votes
            )
    );

    private static final BigInteger BLOCK_LOOKBACK = BigInteger.valueOf(200);

    private final Web3j web3j;
    private final PropertyRepository propertyRepository;
    private final GovernanceService governanceService;

    private BigInteger lastProcessedBlock = null;

    @Scheduled(fixedDelay = 10_000)
    public void poll() {
        if (web3j == null) return;

        try {
            BigInteger currentBlock = web3j.ethBlockNumber().send().getBlockNumber();

            if (lastProcessedBlock == null) {
                lastProcessedBlock = currentBlock.subtract(BLOCK_LOOKBACK);
            }

            BigInteger fromBlock = lastProcessedBlock.add(BigInteger.ONE);
            if (fromBlock.compareTo(currentBlock) > 0) return;

            List<String> daoAddresses = propertyRepository.findAll().stream()
                    .map(p -> p.getDaoContractAddress())
                    .filter(addr -> addr != null && addr.startsWith("0x"))
                    .toList();

            if (daoAddresses.isEmpty()) {
                lastProcessedBlock = currentBlock;
                return;
            }

            pollProposalCreated(fromBlock, currentBlock, daoAddresses);
            pollVoted(fromBlock, currentBlock, daoAddresses);

            lastProcessedBlock = currentBlock;

        } catch (Exception e) {
            log.error("거버넌스 이벤트 폴링 오류", e);
        }
    }

    private void pollProposalCreated(BigInteger from, BigInteger to, List<String> addresses) throws Exception {
        EthFilter filter = new EthFilter(
                DefaultBlockParameter.valueOf(from),
                DefaultBlockParameter.valueOf(to),
                addresses
        );
        filter.addSingleTopic(EventEncoder.encode(PROPOSAL_CREATED_EVENT));

        EthLog ethLog = web3j.ethGetLogs(filter).send();
        if (ethLog.hasError()) {
            log.error("ProposalCreated eth_getLogs 오류: {}", ethLog.getError().getMessage());
            return;
        }

        List<EthLog.LogResult> logs = ethLog.getLogs();
        if (!logs.isEmpty()) {
            log.info("ProposalCreated 이벤트 {}건 감지 (block {} ~ {})", logs.size(), from, to);
        }

        for (EthLog.LogResult<?> result : logs) {
            if (result instanceof EthLog.LogObject logObject) {
                handleProposalCreated(logObject.get());
            }
        }
    }

    private void handleProposalCreated(org.web3j.protocol.core.methods.response.Log eventLog) {
        try {
            String proposalIdHex = eventLog.getTopics().get(1);
            BigInteger onChainProposalId = new BigInteger(proposalIdHex.substring(2), 16);

            String daoContractAddress = eventLog.getAddress();

            @SuppressWarnings({"rawtypes", "unchecked"})
            List<TypeReference<Type>> outputs = (List) List.of(new TypeReference<Utf8String>() {});
            List<Type> values = FunctionReturnDecoder.decode(eventLog.getData(), outputs);
            String rawDescription = (String) values.get(0).getValue();

            String title;
            String description;
            String[] parts = rawDescription.split("\n\n", 2);
            if (parts.length == 2) {
                title = parts[0].trim();
                description = parts[1].trim();
            } else {
                title = rawDescription.trim();
                description = "";
            }

            String proposerAddress = fetchFromAddress(eventLog.getTransactionHash());
            long blockTimestamp = fetchBlockTimestamp(eventLog.getBlockNumber());

            log.info("ProposalCreated 처리 - onChainProposalId: {}, daoContract: {}, proposer: {}",
                    onChainProposalId, daoContractAddress, proposerAddress);

            governanceService.recordProposal(onChainProposalId, proposerAddress,
                    title, description, daoContractAddress, blockTimestamp);

        } catch (Exception e) {
            log.error("ProposalCreated 이벤트 처리 실패 - txHash: {}", eventLog.getTransactionHash(), e);
        }
    }

    private void pollVoted(BigInteger from, BigInteger to, List<String> addresses) throws Exception {
        EthFilter filter = new EthFilter(
                DefaultBlockParameter.valueOf(from),
                DefaultBlockParameter.valueOf(to),
                addresses
        );
        filter.addSingleTopic(EventEncoder.encode(VOTED_EVENT));

        EthLog ethLog = web3j.ethGetLogs(filter).send();
        if (ethLog.hasError()) {
            log.error("Voted eth_getLogs 오류: {}", ethLog.getError().getMessage());
            return;
        }

        List<EthLog.LogResult> logs = ethLog.getLogs();
        if (!logs.isEmpty()) {
            log.info("Voted 이벤트 {}건 감지 (block {} ~ {})", logs.size(), from, to);
        }

        for (EthLog.LogResult<?> result : logs) {
            if (result instanceof EthLog.LogObject logObject) {
                handleVoted(logObject.get());
            }
        }
    }

    private void handleVoted(org.web3j.protocol.core.methods.response.Log eventLog) {
        try {
            String proposalIdHex = eventLog.getTopics().get(1);
            BigInteger onChainProposalId = new BigInteger(proposalIdHex.substring(2), 16);

            @SuppressWarnings({"rawtypes", "unchecked"})
            List<TypeReference<Type>> outputs = (List) Arrays.asList(
                    new TypeReference<Address>() {},
                    new TypeReference<Bool>() {},
                    new TypeReference<Uint256>() {}
            );
            List<Type> values = FunctionReturnDecoder.decode(eventLog.getData(), outputs);

            boolean support = (boolean) values.get(1).getValue();
            BigInteger votesRaw = (BigInteger) values.get(2).getValue();
            long votes = votesRaw.longValueExact();

            log.info("Voted 처리 - onChainProposalId: {}, support: {}, votes: {}",
                    onChainProposalId, support, votes);

            governanceService.recordVote(onChainProposalId, support, votes);

        } catch (Exception e) {
            log.error("Voted 이벤트 처리 실패 - txHash: {}", eventLog.getTransactionHash(), e);
        }
    }

    private String fetchFromAddress(String txHash) {
        try {
            return web3j.ethGetTransactionByHash(txHash).send()
                    .getTransaction()
                    .map(Transaction::getFrom)
                    .orElse(null);
        } catch (Exception e) {
            log.warn("tx.from 조회 실패 - txHash: {}", txHash);
            return null;
        }
    }

    private long fetchBlockTimestamp(BigInteger blockNumber) {
        try {
            return web3j.ethGetBlockByNumber(DefaultBlockParameter.valueOf(blockNumber), false)
                    .send()
                    .getBlock()
                    .getTimestamp()
                    .longValueExact();
        } catch (Exception e) {
            log.warn("block.timestamp 조회 실패 - blockNumber: {}, 서버 시간으로 대체", blockNumber);
            return System.currentTimeMillis() / 1000L;
        }
    }
}
