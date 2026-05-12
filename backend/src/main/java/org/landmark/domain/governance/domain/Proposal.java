package org.landmark.domain.governance.domain;

import jakarta.persistence.*;
import java.math.BigInteger;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.landmark.domain.properties.domain.Property;

import java.util.List;

@Entity
@Table(name = "Proposals")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Proposal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "on_chain_proposal_id", nullable = false, unique = true)
    private BigInteger onChainProposalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "proposer_address", length = 42)
    private String proposerAddress;

    @Column(nullable = false)
    private String title;

    @Lob
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;

    @Column(name = "start_at", nullable = false, updatable = false)
    private Long startAt;

    @Column(name = "end_at", nullable = false)
    private Long endAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> choices;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalStatus status;

    @Column(name = "vote_for", nullable = false)
    private Long voteFor = 0L;

    @Column(name = "vote_against", nullable = false)
    private Long voteAgainst = 0L;

    @Builder
    public Proposal(BigInteger onChainProposalId, Property property, String proposerAddress,
                    String title, String description, Long startAt, Long endAt, List<String> choices) {

        this.onChainProposalId = onChainProposalId;
        this.property = property;
        this.proposerAddress = proposerAddress;
        this.title = title;
        this.description = description;
        this.startAt = startAt;
        this.endAt = endAt;
        this.choices = choices;
        this.voteFor = 0L;
        this.voteAgainst = 0L;
        this.createdAt = System.currentTimeMillis() / 1000L;
        this.status = ProposalStatus.ACTIVE;
    }

    public void addVote(boolean support, long votes) {
        if (support) {
            this.voteFor += votes;
        } else {
            this.voteAgainst += votes;
        }
    }

    public void activate() {
        if (this.status == ProposalStatus.PENDING) {
            this.status = ProposalStatus.ACTIVE;
        }
    }

    public void cancel() {
        if (this.status == ProposalStatus.PENDING || this.status == ProposalStatus.ACTIVE) {
            this.status = ProposalStatus.CANCELLED;
        }
    }
}
