package org.landmark.global.blockchain.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.portfolio.service.HoldingService;
import org.landmark.domain.properties.repository.PropertyRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.EthLog;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

/**
 * PropertyToken의 TokensPurchased(address indexed buyer, uint256 amount, uint256 cost) 이벤트를
 * HTTP eth_getLogs 폴링으로 감지해서 user_holdings에 upsert.
 *
 * lastProcessedBlock 기준으로 새 블록만 조회 — 중복 처리 없음.
 * 30초마다 실행, eth_getLogs 1회 = rate limit 무관.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TokensPurchasedEventListener {

    public static final Event TOKENS_PURCHASED_EVENT = new Event(
            "TokensPurchased",
            Arrays.asList(
                    new TypeReference<Address>(true) {},
                    new TypeReference<Uint256>(false) {},
                    new TypeReference<Uint256>(false) {}
            )
    );

    private static final BigInteger BLOCK_LOOKBACK = BigInteger.valueOf(200);

    private final Web3j web3j;
    private final PropertyRepository propertyRepository;
    private final HoldingService holdingService;

    private BigInteger lastProcessedBlock = null;

    @Scheduled(fixedDelay = 30_000)
    public void poll() {
        if (web3j == null) return;

        try {
            BigInteger currentBlock = web3j.ethBlockNumber().send().getBlockNumber();

            if (lastProcessedBlock == null) {
                // 최초 기동: 최근 BLOCK_LOOKBACK 블록부터 처리
                lastProcessedBlock = currentBlock.subtract(BLOCK_LOOKBACK);
            }

            BigInteger fromBlock = lastProcessedBlock.add(BigInteger.ONE);
            if (fromBlock.compareTo(currentBlock) > 0) return;

            List<String> addresses = propertyRepository.findAll().stream()
                    .map(p -> p.getId())
                    .filter(addr -> addr != null && addr.startsWith("0x"))
                    .toList();

            if (addresses.isEmpty()) {
                lastProcessedBlock = currentBlock;
                return;
            }

            EthFilter filter = new EthFilter(
                    DefaultBlockParameter.valueOf(fromBlock),
                    DefaultBlockParameter.valueOf(currentBlock),
                    addresses
            );
            filter.addSingleTopic(EventEncoder.encode(TOKENS_PURCHASED_EVENT));

            EthLog ethLog = web3j.ethGetLogs(filter).send();
            if (ethLog.hasError()) {
                log.error("eth_getLogs 오류: {}", ethLog.getError().getMessage());
                return;
            }

            List<EthLog.LogResult> logs = ethLog.getLogs();
            if (!logs.isEmpty()) {
                log.info("TokensPurchased 이벤트 {}건 감지 (block {} ~ {})", logs.size(), fromBlock, currentBlock);
            }

            for (EthLog.LogResult<?> result : logs) {
                if (result instanceof EthLog.LogObject logObject) {
                    handle(logObject.get());
                }
            }

            lastProcessedBlock = currentBlock;

        } catch (Exception e) {
            log.error("TokensPurchased 폴링 오류", e);
        }
    }

    private void handle(org.web3j.protocol.core.methods.response.Log eventLog) {
        try {
            String propertyId = eventLog.getAddress().toLowerCase();

            String buyerTopic = eventLog.getTopics().get(1);
            String buyerAddress = "0x" + buyerTopic.substring(buyerTopic.length() - 40);

            @SuppressWarnings({"rawtypes", "unchecked"})
            List<TypeReference<Type>> outputs = (List) Arrays.asList(
                    new TypeReference<Uint256>() {},
                    new TypeReference<Uint256>() {}
            );
            List<Type> values = FunctionReturnDecoder.decode(eventLog.getData(), outputs);
            BigInteger amountWei = (BigInteger) values.get(0).getValue();
            BigInteger costWei = (BigInteger) values.get(1).getValue();

            BigInteger scale = BigInteger.TEN.pow(18);
            long amount = amountWei.divide(scale).longValueExact();
            long cost = costWei.divide(scale).longValueExact();

            log.info("TokensPurchased 처리 - txHash: {}, buyer: {}, propertyId: {}, amount: {}, cost: {}",
                    eventLog.getTransactionHash(), buyerAddress, propertyId, amount, cost);

            holdingService.recordPurchase(buyerAddress, propertyId, amount, cost);

        } catch (Exception e) {
            log.error("TokensPurchased 이벤트 처리 실패 - txHash: {}", eventLog.getTransactionHash(), e);
        }
    }
}
