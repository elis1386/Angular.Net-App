using API.DTO;
using API.Entities;

namespace API.Interfaces;

public interface ILikesRepository
{
    Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId);
    Task<IEnumerable<MemberDTO>> GetUserLikes(string predicate, int userId);
    Task<IEnumerable<int>> GetCurrentUserLikeId(int currentUserId);

    void DeleteLike(UserLike like);
    void AddLike(UserLike loke);
    Task<bool> SaveChenges();

}
