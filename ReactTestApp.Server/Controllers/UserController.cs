using Microsoft.AspNetCore.Mvc;
using ReactTestApp.Server.Models;
using ReactTestApp.Server.Services;
using System.Collections.Generic;

namespace ReactTestApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            return UserService.GetAll();
        }

        [HttpGet("{id}")]
        public ActionResult<User> GetUser(int id)
        {
            var user = UserService.Get(id);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(user);
            }
        }

        [HttpGet("active")]
        public ActionResult<IEnumerable<User>> GetActiveUsers()
        {
            var activeUsers = UserService.GetActiveUsers();
            return Ok(activeUsers);
        }

        [HttpGet("inactive")]
        public ActionResult<IEnumerable<User>> GetInactiveUsers()
        {
            var inactiveUsers = UserService.GetInactiveUsers();
            return Ok(inactiveUsers);
        }

        [HttpPost]
        public ActionResult<User> CreateUser(User user)
        {
            UserService.Add(user);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateUser(int id, User updatedUser)
        {
            var existingUser = UserService.Get(id);
            if (existingUser == null)
            {
                return NotFound();
            }
            else
            {
                UserService.Update(updatedUser);
                return NoContent();
            }
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteUser(int id)
        {
            var user = UserService.Get(id);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                UserService.Delete(id);
                return NoContent();
            }
        }
    }
}
