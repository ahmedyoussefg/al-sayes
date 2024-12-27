package org.example.backend.dao;

import org.example.backend.dto.UserDetails;
import org.example.backend.entity.Account;
import org.example.backend.entity.ParkingLot;
import org.example.backend.enums.PaymentMethod;
import org.example.backend.enums.UserStatus;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class AccountDAO implements DAO<Account, Long>  {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Account> rowMapper = (rs, rowNum) -> {
        Account account = new Account();
        account.setId(rs.getLong("id"));
        account.setUsername(rs.getString("username"));
        account.setEmail(rs.getString("email"));
        account.setPassword(rs.getString("password"));
        account.setRole(rs.getString("role_name"));
        account.setStatus(UserStatus.valueOf(rs.getString("status")));
        return account;
    };

    public AccountDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Account> listAll() {
        String sql = "SELECT * FROM Account";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public void insert(Account account) {
        String accountSql =
                "INSERT INTO Account(username, email, password, role_name, status) VALUES(?,?,?,?,?)";
        jdbcTemplate.update(accountSql, account.getUsername(),
                account.getEmail(), account.getPassword(), "ROLE_" + account.getRole().toUpperCase(),
                UserStatus.ACTIVE.name());
    }

    public String getRoleByUsername(String username) {
        String roleSql = "SELECT role_name FROM Account WHERE username = ?";
        return jdbcTemplate.queryForObject(roleSql, String.class, username);
    }

    @Override
    public Optional<Account> getByPK(Long id) {
        String sql = "SELECT * FROM Account WHERE id = ?";
        Account account = null;
        try {
            account = jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch(DataAccessException e) {
            // Not Found
        }
        return Optional.ofNullable(account);
    }

    @Override
    public void update(Long id, Account account) {
        String sql = "UPDATE Account SET username = ?, email = ?, password = ?, role_name = ? WHERE id = ?";
        jdbcTemplate.update(sql, account.getUsername(), account.getEmail(), account.getPassword(),
                "ROLE_" + account.getRole().toUpperCase(), id);
    }

    @Override
    public void delete(Long pKey) {
        String sql = "DELETE FROM Account WHERE id = ?";
        jdbcTemplate.update(sql, pKey);
    }

    public Optional<Account> getByUsername(String username) {
        String sql = "SELECT * FROM Account WHERE username = ?";
        Account account = null;
        try {
            account = jdbcTemplate.queryForObject(sql, rowMapper, username);
        } catch(DataAccessException e) {
            // Not Found
        }
        return Optional.ofNullable(account);
    }

    public Optional<UserDetails> getUserDetailsByUsername(String username) {
        String sql = "SELECT * FROM Account WHERE username = ?";
        final UserDetails[] userDetails = {null};
        try {
            userDetails[0] = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                UserDetails user = UserDetails.builder()
                        .id(rs.getLong("id"))
                        .username(rs.getString("username"))
                        .email(rs.getString("email"))
                        .role(rs.getString("role_name").split("_")[1].toLowerCase())
                        .build();
                return user;
            }, username);
            if (userDetails[0] != null && "driver".equalsIgnoreCase(userDetails[0].getRole())) {
                String driverSql = "SELECT * FROM Driver WHERE account_id = ?";
                jdbcTemplate.queryForObject(driverSql, (rs, rowNum) -> {
                    userDetails[0].setLicensePlate(rs.getString("license_plate"));
                    userDetails[0].setPaymentMethod(rs.getString("payment_method").toLowerCase());
                    return null;
                }, userDetails[0].getId());
            }

        } catch(DataAccessException e) {
            // Not Found
        }
        return Optional.ofNullable(userDetails[0]);
    }

    public void blockUser(String username) {
        String sql = "UPDATE Account SET status = ? WHERE username = ?";
        jdbcTemplate.update(sql, UserStatus.BLOCKED.name(), username);
    }

    public void unblockUser(String username) {
        String sql = "UPDATE Account SET status = ? WHERE username = ?";
        jdbcTemplate.update(sql, UserStatus.ACTIVE.name(), username);
    }

    public boolean isActive(String username) {
        String sql = "SELECT status FROM Account WHERE username = ?";
        return UserStatus.ACTIVE.name().equals(jdbcTemplate.queryForObject(sql, String.class, username));
    }
}
