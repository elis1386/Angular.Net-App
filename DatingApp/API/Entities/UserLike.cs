namespace API.Entities;

public class UserLike
{
    public AppUser SourseUser { get; set; } = null!;
    public int SourseUserId { get; set; }
    public AppUser TargetUser { get; set; } = null!;
    public int TargetUserId { get; set; }

}
