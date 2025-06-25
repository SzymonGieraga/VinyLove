package gieraga.vinylove.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity
public class RecordOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artists;

    @Lob
    private String description;

    private String coverImageUrl;

    private String audioSampleUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "recordOffer", cascade = CascadeType.ALL)
    private List<Rental> rentals;


    @ManyToMany(mappedBy = "observedOffers")
    private Set<User> observers;

    @OneToMany(mappedBy = "recordOffer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecordReview> reviews;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "return_address_id")
    private Address returnAddress;
}
