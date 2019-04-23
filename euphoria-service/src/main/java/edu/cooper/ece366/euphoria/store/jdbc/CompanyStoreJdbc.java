package edu.cooper.ece366.euphoria.store.jdbc;

import edu.cooper.ece366.euphoria.model.Company;
import edu.cooper.ece366.euphoria.model.CompanyBuilder;
import edu.cooper.ece366.euphoria.store.model.CompanyStore;

import java.sql.*;

public class CompanyStoreJdbc implements CompanyStore {

    private static final String GET_COMPANY_STATEMENT = "SELECT * FROM companies WHERE companyId = ?";
    private static final String CREATE_COMPANY_STATEMENT = "INSERT INTO companies (name, website, description) VALUES (?, ?, ?)";

    private final DataSource dataSource;

    public CompanyStoreJdbc(final DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Company getCompany(final String companyId) {
        try {
            Connection connection = dataSource.getConnection();

            PreparedStatement ps = connection.prepareStatement(GET_COMPANY_STATEMENT);
            ps.setInt(1, Integer.parseInt(companyId));

            ResultSet rs = ps.executeQuery();

            if (rs.first()) {
                return new CompanyBuilder()
                        .companyId(rs.getInt("companyId"))
                        .name(rs.getString("name"))
                        .website(rs.getString("website"))
                        .description(rs.getString("description"))
                        .build();
            } else {
                return null;
            }
        } catch (SQLException e) {
            throw new RuntimeException("error fetching company", e);
        }
    }


    @Override
    public Company createCompany(final String name, final String website, final String description) {
        try {
            Connection connection = dataSource.getConnection();

            PreparedStatement ps = connection.prepareStatement(CREATE_COMPANY_STATEMENT, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, name);
            ps.setString(2, website);
            ps.setString(3, description);
            int rowsAffected = ps.executeUpdate();

            if (rowsAffected == 0) {
                throw new SQLException("Creating new company failed, no rows affected.");
            }
            ResultSet generatedKeys = ps.getGeneratedKeys();
            if (generatedKeys.first()) {
                return new CompanyBuilder()
                        .companyId(generatedKeys.getInt(1))
                        //only want to send the Id, but don't know how to return just an integer alone without the builder, so putting placeholder values below
                        .name("NA")
                        .website("NA")
                        .description("NA")
                        .build();
            } else {
                return null;
            }
        } catch (SQLException e) {
            throw new RuntimeException("error creating company", e);
        }
    }
}
