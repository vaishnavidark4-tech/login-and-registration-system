package com.vaishnavi.loginapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "chains")
public class Chain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false, unique = true)
    private String gstn;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    // Default constructor
    public Chain() {
    }

    // Get ID
    public Long getId() {
        return id;
    }

    // Set ID
    public void setId(Long id) {
        this.id = id;
    }

    // Get company name
    public String getCompanyName() {
        return companyName;
    }

    // Set company name
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    // Get GSTN
    public String getGstn() {
        return gstn;
    }

    // Set GSTN
    public void setGstn(String gstn) {
        this.gstn = gstn;
    }

    // Get Group
    public Group getGroup() {
        return group;
    }

    // Set Group
    public void setGroup(Group group) {
        this.group = group;
    }
}