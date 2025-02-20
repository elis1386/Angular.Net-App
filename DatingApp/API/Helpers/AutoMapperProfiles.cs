using API.DTO;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDTO>()
            .ForMember(dest => dest.Age, opt =>
                opt.MapFrom(source => source.DateOfBirth.CalculateAge()))
            .ForMember(dest => dest.PhotoUrl, opt =>
            opt.MapFrom(source => source.Photos.FirstOrDefault(x => x.IsMain)!.Url));
        CreateMap<Photo, PhotoDTO>();
        CreateMap<MemberUpdateDTO, AppUser>();
        CreateMap<RegisterDTO, AppUser>();
        CreateMap<string, DateOnly>().ConstructUsing(s => DateOnly.Parse(s));
        CreateMap<Message, MessageDTO>()
                .ForMember(d => d.SenderPhotoUrl, o => o
                .MapFrom(s => s.Sender.Photos.FirstOrDefault(x => x.IsMain)!.Url))
                .ForMember(d => d.RecipientPhotoUrl, o => o
                .MapFrom(s => s.Recipient.Photos.FirstOrDefault(x => x.IsMain)!.Url));
    }

}
