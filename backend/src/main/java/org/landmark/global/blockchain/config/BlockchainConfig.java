package org.landmark.global.blockchain.config;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.Nullable;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import java.math.BigInteger;

@Slf4j
@Getter
@Configuration
public class BlockchainConfig {

    @Value("${blockchain.network.rpc-url:}")
    private String rpcUrl;

    @Value("${blockchain.network.ws-url:}")
    private String wsUrl;

    @Value("${blockchain.network.chain-id:0}")
    private Long chainId;

    @Value("${blockchain.wallet.private-key:}")
    private String privateKey;

    @Value("${blockchain.contract.krwt-token-address:}")
    private String krwtTokenAddress;

    @Value("${blockchain.contract.token-factory-address:}")
    private String tokenFactoryAddress;

    @Value("${blockchain.contract.identity-registry-address:}")
    private String identityRegistryAddress;

    @Value("${blockchain.contract.claim-topics-registry-address:}")
    private String claimTopicsRegistryAddress;

    @Value("${blockchain.contract.trusted-issuers-registry-address:}")
    private String trustedIssuersRegistryAddress;

    @Value("${blockchain.contract.modular-compliance-address:}")
    private String modularComplianceAddress;

    /* Web3j 인스턴스 생성 */
    @Bean
    public Web3j web3j() {
        if (rpcUrl == null || rpcUrl.isEmpty()) {
            log.warn("블록체인 RPC URL이 설정되지 않았습니다. Web3j를 초기화하지 않습니다.");
            return null;
        }

        log.info("Web3j 초기화 중 - RPC URL: {}", rpcUrl);
        return Web3j.build(new HttpService(rpcUrl));
    }

    /* Credentials 생성 */
    @Bean
    public Credentials credentials() {
        if (privateKey == null || privateKey.isEmpty()) {
            log.warn("블록체인 프라이빗 키가 설정되지 않았습니다. Credentials를 초기화하지 않습니다.");
            return null;
        }

        log.info("Credentials 초기화 중");

        Credentials creds = Credentials.create(privateKey);
        log.info("Wallet 주소: {}", creds.getAddress());
        return creds;
    }

    /* Gas Provider - 테스트넷용 낮은 가스비 설정 */
    @Bean
    public DefaultGasProvider gasProvider() {
        // return new DefaultGasProvider();

        BigInteger gasPrice = BigInteger.valueOf(1_000_000_000L); // 1 Gwei
        BigInteger gasLimit = BigInteger.valueOf(500_000L); // 500K gas limit

        log.info("Gas Provider 설정 - gasPrice: {} Gwei, gasLimit: {}",
                gasPrice.divide(BigInteger.valueOf(1_000_000_000L)), gasLimit);

        return new DefaultGasProvider() {
            @Override
            public BigInteger getGasPrice() {
                return gasPrice;
            }

            @Override
            public BigInteger getGasLimit() {
                return gasLimit;
            }
        };
    }
}
