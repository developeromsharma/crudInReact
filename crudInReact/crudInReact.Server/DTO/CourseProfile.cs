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
            }
    }
}
