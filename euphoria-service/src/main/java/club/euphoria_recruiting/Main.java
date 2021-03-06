package club.euphoria_recruiting;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spotify.apollo.Environment;
import com.spotify.apollo.httpservice.HttpService;
import com.spotify.apollo.httpservice.LoadingException;
import com.spotify.apollo.route.Route;
import club.euphoria_recruiting.handler.*;
import club.euphoria_recruiting.store.jdbc.*;
import club.euphoria_recruiting.store.model.*;
import io.norberg.automatter.jackson.AutoMatterModule;

public class Main {
    public static void main(String[] args) throws LoadingException {
        HttpService.boot(Main::init, "euphoria-service", args);
    }

    private static void init(final Environment environment) {
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new AutoMatterModule());
        DataSource dataSource = new DataSource(environment.config());

        ApplicationStore applicationStore = new ApplicationStoreJdbc(dataSource, environment.config());
        ApplicationHandlers applicationHandlers = new ApplicationHandlers(objectMapper, applicationStore);

        AuthenticationStore authenticationStore = new AuthenticationStoreJdbc(dataSource);
        AuthenticationHandlers authenticationHandlers = new AuthenticationHandlers(objectMapper, authenticationStore);

        CompanyStore companyStore = new CompanyStoreJdbc(dataSource);
        CompanyHandlers companyHandlers = new CompanyHandlers(objectMapper, companyStore);

        CookieStore cookieStore = new CookieStoreJdbc(dataSource);
        CookieHandlers cookieHandlers = new CookieHandlers(objectMapper, cookieStore);

        PostingStore postingStore = new PostingStoreJdbc(dataSource, environment.config());
        PostingHandlers postingHandlers = new PostingHandlers(objectMapper, postingStore);

        UserStore userStore = new UserStoreJdbc(dataSource);
        UserHandlers userHandlers = new UserHandlers(objectMapper, userStore);


        environment
                .routingEngine()
                .registerAutoRoute(Route.sync("GET", "/ping", rc -> "pong"))
                .registerRoutes(applicationHandlers.routes())
                .registerRoutes(authenticationHandlers.routes())
                .registerRoutes(companyHandlers.routes())
                .registerRoutes(cookieHandlers.routes())
                .registerRoutes(postingHandlers.routes())
                .registerRoutes(userHandlers.routes());
    }
}
