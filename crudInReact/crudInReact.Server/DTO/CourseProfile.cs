using AutoMapper;
using crudInReact.Server.Models;

namespace crudInReact.Server.DTO
{
    public class CourseProfile : Profile
    {
        public CourseProfile()
        {
            // Mapping: AddCourseDTO -> CourseModel
            CreateMap<AddCourseDTO, CourseModel>();

            // Mapping: CourseModel -> AddCourseDTO (Only keep if needed for editing forms)
            CreateMap<CourseModel, AddCourseDTO>();

            // Mapping: UpdateCourseDto -> CourseModel
            // Only map properties that are not null
            CreateMap<UpdateCourseDto, CourseModel>()
                .ForAllMembers(opt =>
                    opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
