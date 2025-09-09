import React, { useState } from "react";

const UpdateMentorForm = (props) => {
  const [formData, setFormData] = useState({
    firstName: props.mentorData.firstName,
    lastName: props.mentorData.lastName,
    email: props.mentorData.email,
    projectCategory: props.mentorData.projectCategory,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.mentorData.id) {
      props.handleUpdateMentor(props.mentorData.id, formData);
    } else {
      console.error("mentorData.id is missing");
    }
  };

  return (
    <>
      {/* Modal */}
      <input
        type="checkbox"
        id="my_modal_6"
        className="modal-toggle"
        defaultChecked
      />
      <div className="modal modal-open" role="dialog">
        <div className="modal-box relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-auto">
          {/* Close Button (X) */}
          <button
            className="absolute top-2 right-2 w-8 h-8 btn btn-soft text-lg font-bold cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-2 rounded-full flex text-center items-center justify-center text-gray-900 dark:text-white"
            onClick={props.handleClose}
          >
            &times;
          </button>

          {/*Header*/}
          <h3 className="text-xl font-semibold text-[#1b0a5f] dark:text-yellow-400 mb-6 text-center">
            Update Mentor Profile
          </h3>

          {/* Form for updating mentor */}
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-300">First Name</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input input-bordered w-full text-lg px-4 py-2 rounded-md border-2 border-[#1b0a5f] dark:border-gray-600 focus:ring-2 focus:ring-[#6c50e1] focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-300">Last Name</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input input-bordered w-full text-lg px-4 py-2 rounded-md border-2 border-[#1b0a5f] dark:border-gray-600 focus:ring-2 focus:ring-[#6c50e1] focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-300">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full text-lg px-4 py-2 rounded-md border-2 border-[#1b0a5f] dark:border-gray-600 focus:ring-2 focus:ring-[#6c50e1] focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-300">
                  Project Category
                </span>
              </label>
              <input
                type="text"
                name="projectCategory"
                value={formData.projectCategory}
                onChange={handleChange}
                className="input input-bordered w-full text-lg px-4 py-2 rounded-md border-2 border-[#1b0a5f] dark:border-gray-600 focus:ring-2 focus:ring-[#6c50e1] focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Update Button */}
            <div className="modal-action flex justify-center w-full mt-6">
              <button
                type="submit"
                className="btn bg-[#1b0a5f] dark:bg-blue-600 text-white hover:bg-[#6c50e1] dark:hover:bg-blue-700 rounded-md px-6 py-2 transition-colors"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateMentorForm;