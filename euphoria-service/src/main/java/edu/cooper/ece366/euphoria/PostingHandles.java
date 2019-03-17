package edu.cooper.ece366.euphoria;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spotify.apollo.RequestContext;
import com.spotify.apollo.Response;
import com.spotify.apollo.route.*;
import okio.ByteString;

import java.sql.*;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

public class PostingHandles implements RouteProvider {
    private static final String dbUrl = "jdbc:mysql://localhost:3306/euphoria";
    private static final String dbUsername = "euphoria";
    private static final String dbPassword = "euphoria";
    private final ObjectMapper objectMapper;

    public PostingHandles(final ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Stream<Route<AsyncHandler<Response<ByteString>>>> routes() {
        return Stream.of(
                Route.sync("GET", "/posting/<postingId>", this::getPosting),
                Route.sync("POST", "/posting/<jobTitle>/<description>/<location>/<skillLevel>/<industry>", this::createPosting)
        ).map(r -> r.withMiddleware(jsonMiddleware()));
    }

    private List<Posting> getPosting(final RequestContext requestContext) {
        Posting posting = null;

        try {
            Integer postingId = Integer.valueOf(requestContext.pathArgs().get("postingId"));
            Connection conn = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
            String sqlQuery = "SELECT * FROM postings WHERE postingId = ?";
            PreparedStatement stmt = conn.prepareStatement(sqlQuery);
            stmt.setInt(1, postingId);
            ResultSet resultSet = stmt.executeQuery();

            if (resultSet.next()) {  //FIXME Only read the first result. There should only be one, after all...
                posting = new PostingBuilder()
                        .postingId(resultSet.getInt("postingId"))
                        .jobTitle(resultSet.getString("jobTitle"))
                        .description(resultSet.getString("description"))
                        .location(Location.valueOf(resultSet.getString("location")))
                        .skillLevel(SkillLevel.valueOf(resultSet.getString("skillLevel")))
                        .industry(Industry.valueOf(resultSet.getString("industry")))
                        .build();
            }
        } catch (SQLException ex) {
            System.out.println(ex);
        }

        return Collections.singletonList(posting);
    }

    private List<Posting> createPosting(final RequestContext requestContext) {
        String jobTitle = null;
        String description = null;
        Location location = null;
        SkillLevel skillLevel = null;
        Industry industry = null;

        try {
            jobTitle = requestContext.pathArgs().get("jobTitle");
            description = requestContext.pathArgs().get("description");
            location = Location.valueOf(requestContext.pathArgs().get("location"));
            skillLevel = SkillLevel.valueOf(requestContext.pathArgs().get("skillLevel"));
            industry = Industry.valueOf(requestContext.pathArgs().get("industry"));
        } catch (Exception ex) {
            System.out.println("Malformed POST request: " + ex.getMessage());
        }

        Connection conn = null;
        Posting posting = null;

        try {
            conn = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
        } catch (SQLException ex) {
            System.out.println("SQL exception on connection: " + ex.getMessage());
        }

        try {
            String statement = "INSERT INTO postings (companyId, jobTitle, " +
                    "description, location, industry, skillLevel, " +
                    "dateCreated) VALUES (?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement query = conn.prepareStatement(statement);
            query.setString(1, jobTitle);
            query.setString(2, description);
            query.setString(3, location.toString());
            query.setString(4, skillLevel.toString());
            query.setString(5, industry.toString());
            query.setDate(6, (java.sql.Date) dateCreated);  //FIXME use the current datetime.
            query.executeUpdate();
        } catch (SQLException ex) {
            System.out.println("SQL exception on query: " + ex.getMessage());
        }

        return Collections.emptyList();
    }

    private <T> Middleware<AsyncHandler<T>, AsyncHandler<Response<ByteString>>> jsonMiddleware() {
        return JsonSerializerMiddlewares.<T>jsonSerialize(objectMapper.writer())
                .and(Middlewares::httpPayloadSemantics);
    }
}
