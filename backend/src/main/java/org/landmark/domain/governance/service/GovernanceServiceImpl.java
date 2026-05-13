package org.landmark.domain.governance.service;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.landmark.domain.governance.domain.Proposal;
import org.landmark.domain.governance.domain.ProposalStatus;
import org.landmark.domain.governance.domain.VoteType;
import org.landmark.domain.governance.dto.ProposalResponse;
import org.landmark.domain.governance.repository.ProposalRepository;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.repository.PropertyRepository;
import org.landmark.domain.user.domain.User;
import org.landmark.domain.user.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GovernanceServiceImpl implements GovernanceService {
  private final ProposalRepository proposalRepository;
  private final PropertyRepository propertyRepository;
  private final UserRepository userRepository;

  @Override
  public List<ProposalResponse> findAllProposals(String propertyId) {
    List<Proposal> proposals;
    Sort sort = Sort.by(Sort.Direction.DESC, "id");

    if (propertyId != null && !propertyId.isEmpty()) {
      proposals = proposalRepository.findByProperty_Id(propertyId);
    } else {
      proposals = proposalRepository.findAll(sort);
    }

    return proposals.stream()
        .map(ProposalResponse::from)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public void recordProposal(BigInteger onChainProposalId, String proposerAddress,
                              String title, String description, String propertyId, long now) {
    if (proposalRepository.findByOnChainProposalId(onChainProposalId).isPresent()) {
      return;
    }

    Property property = propertyRepository.findByDaoContractAddressIgnoreCase(propertyId).orElse(null);
    if (property == null) {
      log.warn("ProposalCreated 이벤트 — 등록되지 않은 부동산, 스킵 - daoContractAddress: {}", propertyId);
      return;
    }

    long endAt = now + (3L * 24 * 60 * 60);

    List<String> choices = Arrays.stream(VoteType.values())
        .map(Enum::name)
        .collect(Collectors.toList());

    Proposal proposal = Proposal.builder()
        .onChainProposalId(onChainProposalId)
        .property(property)
        .proposerAddress(proposerAddress)
        .title(title)
        .description(description)
        .startAt(now)
        .endAt(endAt)
        .choices(choices)
        .build();

    proposalRepository.save(proposal);
    log.info("안건 저장 완료 - onChainProposalId: {}, propertyId: {}", onChainProposalId, propertyId);
  }

  @Override
  @Transactional
  public void recordVote(BigInteger onChainProposalId, boolean support, long votes) {
    Proposal proposal = proposalRepository.findByOnChainProposalId(onChainProposalId)
        .orElse(null);
    if (proposal == null) {
      log.warn("Voted 이벤트 — 해당 안건 없음, 스킵 - onChainProposalId: {}", onChainProposalId);
      return;
    }
    proposal.addVote(support, votes);
  }

  @Override
  @Transactional
  public Long cancelProposal(String userId, Long proposalId) {
    Proposal proposal = proposalRepository.findById(proposalId)
        .orElseThrow(() -> new BusinessException(ErrorCode.PROPOSAL_NOT_FOUND));

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    if (!proposal.getProposerAddress().equalsIgnoreCase(user.getWalletAddress())) {
      throw new BusinessException(ErrorCode.FORBIDDEN_EXCEPTION);
    }

    if (proposal.getStatus() != ProposalStatus.PENDING && proposal.getStatus() != ProposalStatus.ACTIVE) {
      throw new BusinessException(ErrorCode.PROPOSAL_CANNOT_CANCEL);
    }

    proposal.cancel();
    return proposal.getId();
  }
}
