package org.landmark.domain.governance.dto;

import java.util.List;
import org.landmark.domain.governance.domain.Proposal;
import org.landmark.domain.governance.domain.ProposalStatus;

public record ProposalResponse(
    String id,
    String title,
    String description,

    String propertyId,
    String propertyName,
    Long totalTokens,

    String proposerAddress,
    Long startAt,
    Long endAt,
    List<String> choices,
    ProposalStatus status,
    Long voteFor,
    Long voteAgainst
) {
  public static ProposalResponse from(Proposal proposal) {
    return new ProposalResponse(
        String.valueOf(proposal.getId()),
        proposal.getTitle(),
        proposal.getDescription(),
        proposal.getProperty().getId(),
        proposal.getProperty().getName(),
        proposal.getProperty().getTotalTokens(),
        proposal.getProposerAddress(),
        proposal.getStartAt(),
        proposal.getEndAt(),
        proposal.getChoices(),
        proposal.getStatus(),
        proposal.getVoteFor(),
        proposal.getVoteAgainst()
    );
  }
}
