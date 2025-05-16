using crudInReact.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace crudInReact.Server.Controllers
{
    [ApiController]
    public class BaseController : ControllerBase
    {
        // Success with data
        protected ActionResult<ApiResponse<T>> SuccessResponse<T>(T data, string message = "")
        {
            return Ok(new ApiResponse<T>(data, message));
        }

        // Success with only message, no data
        protected ActionResult<ApiResponse<object>> SuccessMessage(string message)
        {
            return Ok(new ApiResponse<object>(null, message));
        }

        // Error response with generic data type (usually null)
        protected ActionResult<ApiResponse<T>> ErrorResponse<T>(string message, List<string> errors = null)
        {
            return BadRequest(new ApiResponse<T>(message, errors));
        }

        // Error message without data (non-generic)
        protected ActionResult<ApiResponse<object>> ErrorMessage(string message, List<string> errors = null)
        {
            return BadRequest(new ApiResponse<object>(message, errors));
        }

        // Generic - when response type is ApiResponse<T>
        protected ActionResult<ApiResponse<T>> NotFoundResponse<T>(string message)
        {
            return NotFound(new ApiResponse<T>(message));
        }

        // Non-generic - when response type is ApiResponse<object>
        protected ActionResult<ApiResponse<object>> NotFoundResponse(string message)
        {
            return NotFound(new ApiResponse<object>(message));
        }
    }
}
