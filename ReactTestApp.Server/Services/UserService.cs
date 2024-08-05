using ReactTestApp.Server.Models;

namespace ReactTestApp.Server.Services
{
    public static class UserService
    {
        static List<User> Users { get; }


        static UserService()
        {
            Users = new List<User>
            {
                new User { Id = 1, Name = "Nazar1", Email = "nazar@ex.ex", isActive = true},
                new User { Id = 2, Name = "Jack",   Email = "asd@ex.ex", isActive = false},
                new User { Id = 3, Name = "Tomek", Email = "asd@ex.ex", isActive = true},
                new User { Id = 4, Name = "Ola", Email = "asd@ex.ex", isActive = true},
                new User { Id = 5, Name = "Anna", Email = "asd@ex.ex", isActive = false}
            };
        }

        public static List<User> GetAll() => Users;

        public static User? Get(int id) => Users.FirstOrDefault(u => u.Id == id);

        public static void Add(User user)
        {
            user.Id = Users.Count > 0 ? Users.Max(u => u.Id) + 1 : 1;
            Users.Add(user);
        }
        public static void Delete(int id)
        {
            var user = Get(id);
            if (user is null)
                return;

            Users.Remove(user);
        }

        public static void Update(User user)
        {
            var index = Users.FindIndex(u => u.Id == user.Id);
            if (index == -1)
                return;

            Users[index] = user;
        }

        public static List<User> GetActiveUsers() => Users.Where(u => u.isActive).ToList();

        public static List<User> GetInactiveUsers() => Users.Where(u => !u.isActive).ToList();
    }
}