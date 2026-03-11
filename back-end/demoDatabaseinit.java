package a2.startup2.co2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import a2.startup2.co2.Model.user;
import a2.startup2.co2.Repos.userrepository;

@Component
public class Databaseinit implements org.springframework.boot.CommandLineRunner {
@Autowired
private userrepository userrepository;
    @Override
    public void run(String... args) throws Exception {
        System.out.println("Database initialized");
            userrepository.deleteAll();
            user u1 = new user ("mudaser", "mudaser@example.com", "password123");
            userrepository.save(u1);
    }
    
}
