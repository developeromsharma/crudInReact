namespace crudInReact.Server.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }      // true or false
        public string Message { get; set; }    // e.g. "Course added successfully"
        public T Data { get; set; }             // the payload, nullable
        public List<string> Errors { get; set; }  // optional error list

        public ApiResponse() { }

        // Convenience constructor for success
        public ApiResponse(T data, string message = "")
        {
            Success = true;
            Message = message;
            Data = data;
            Errors = null;
        }

        // Convenience constructor for failure
        public ApiResponse(string message, List<string> errors = null)
        {
            Success = false;
            Message = message;
            Errors = errors;
        }
    }

}
