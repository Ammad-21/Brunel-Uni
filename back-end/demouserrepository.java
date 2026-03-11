package a2.startup2.co2.Repos;

import a2.startup2.co2.Model.user;
import org.springframework.data.repository.CrudRepository;


public interface userrepository extends CrudRepository<user, Long>{
    user findByEmail(String email);
    
}
