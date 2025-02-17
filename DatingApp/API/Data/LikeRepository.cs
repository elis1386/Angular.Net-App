using API.DTO;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikeRepository(DataContext context, IMapper mapper) : ILikesRepository
{
    public void AddLike(UserLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(UserLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IEnumerable<int>> GetCurrentUserLikeId(int currentUserId)
    {
        return await context.Likes
            .Where(x => x.SourseUserId == currentUserId)
            .Select(x => x.TargetUserId)
            .ToListAsync();
    }

    public async Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId)
    {
        return await context.Likes.FindAsync(sourceUserId, targetUserId);
    }

    public async Task<IEnumerable<MemberDTO>> GetUserLikes(string predicate, int userId)
    {
        var likes = context.Likes.AsQueryable();
        switch (predicate)
        {
            case "liked":
                return await likes
                .Where(x => x.SourseUserId == userId)
                .Select(x => x.TargetUser)
                .ProjectTo<MemberDTO>(mapper.ConfigurationProvider)
                .ToListAsync();
            case "likedBy":
                return await likes
                .Where(x => x.TargetUserId == userId)
                .Select(x => x.SourseUser)
                .ProjectTo<MemberDTO>(mapper.ConfigurationProvider)
                .ToListAsync();
            default:
                var likeIds = await GetCurrentUserLikeId(userId);
                return await likes
                .Where(x => x.TargetUserId == userId && likeIds.Contains(x.SourseUserId))
                .Select(x => x.SourseUser)
                .ProjectTo<MemberDTO>(mapper.ConfigurationProvider)
                .ToListAsync();
        }

    }

    public async Task<bool> SaveChenges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
