using API.DTO;
using API.Entities;
using API.Helpers;
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

    public async Task<PagedList<MemberDTO>> GetUserLikes(LikesParams likesParams)
    {
        var likes = context.Likes.AsQueryable();
        IQueryable<MemberDTO> query;
        switch (likesParams.Predicate)
        {
            case "liked":
                query = likes
                .Where(x => x.SourseUserId == likesParams.UserId)
                .Select(x => x.TargetUser)
                .ProjectTo<MemberDTO>(mapper.ConfigurationProvider);
                break;
            case "likedBy":
                query = likes
                .Where(x => x.TargetUserId == likesParams.UserId)
                .Select(x => x.SourseUser)
                .ProjectTo<MemberDTO>(mapper.ConfigurationProvider);
                break;
            default:
                var likeIds = await GetCurrentUserLikeId(likesParams.UserId);
                query = likes
                .Where(x => x.TargetUserId == likesParams.UserId && likeIds.Contains(x.SourseUserId))
                .Select(x => x.SourseUser)
                .ProjectTo<MemberDTO>(mapper.ConfigurationProvider);
                break;
        }
        return await PagedList<MemberDTO>.CreateAsync(query, likesParams.PageNumber, likesParams.PageSize);

    }

    public async Task<bool> SaveChenges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
