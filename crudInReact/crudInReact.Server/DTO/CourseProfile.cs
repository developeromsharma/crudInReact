using AutoMapper;
using crudInReact.Server.Models;

namespace crudInReact.Server.DTO
{
    public class CourseProfile : Profile
    {
            public CourseProfile()
            {
                //Source -> Target
                CreateMap<AddCourseDTO, CourseModel>();
                CreateMap<CourseModel, AddCourseDTO>();
                
                CreateMap<UpdateCourseDto, CourseModel>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));


        }
    }
}
