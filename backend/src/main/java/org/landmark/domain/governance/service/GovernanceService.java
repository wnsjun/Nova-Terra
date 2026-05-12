package org.landmark.domain.governance.service;

import java.math.BigInteger;
import java.util.List;
import org.landmark.domain.governance.dto.ProposalResponse;

public interface GovernanceService {
  List<ProposalResponse> findAllProposals(String propertyId);
  void recordProposal(BigInteger onChainProposalId, String proposerAddress,
                      String title, String description, String propertyId, long now);
  void recordVote(BigInteger onChainProposalId, boolean support, long votes);
  Long cancelProposal(String userId, Long proposalId);
}
