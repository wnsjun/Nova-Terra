package org.landmark.domain.governance.repository;

import java.math.BigInteger;
import java.util.Optional;
import org.landmark.domain.governance.domain.Proposal;
import org.landmark.domain.governance.domain.ProposalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByStatus(ProposalStatus status);

    List<Proposal> findByProperty_Id(String propertyId);

    List<Proposal> findByProposerAddress(String proposerAddress);

    Optional<Proposal> findByOnChainProposalId(BigInteger onChainProposalId);

    List<Proposal> findByStatusAndStartAtLessThanEqualAndEndAtGreaterThan(
        ProposalStatus status, Long now1, Long now2
    );
}
