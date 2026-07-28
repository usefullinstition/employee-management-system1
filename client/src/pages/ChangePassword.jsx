import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function ChangePassword() {

  const [form,setForm]=useState({

    currentPassword:"",
    newPassword:"",
    confirmPassword:""

  });

  const handleChange=(e)=>{

    setForm({

      ...form,

      [e.target.name]:e.target.value

    });

  };

  const handleSubmit=async(e)=>{

    e.preventDefault();

    if(form.newPassword!==form.confirmPassword){

      toast.error("Passwords do not match");

      return;

    }

    try{

      await API.put(
        "/auth/change-password",
        form
      );

      toast.success(
        "Password Changed Successfully"
      );

      setForm({

        currentPassword:"",
        newPassword:"",
        confirmPassword:""

      });

    }catch(err){

      toast.error(

        err.response?.data?.message ||

        "Failed to change password"

      );

    }

  };

  return(

<div className="container mt-4">

<h2>
Change Password
</h2>

<form onSubmit={handleSubmit}>

<input
type="password"
name="currentPassword"
placeholder="Current Password"
className="form-control mb-3"
value={form.currentPassword}
onChange={handleChange}
/>

<input
type="password"
name="newPassword"
placeholder="New Password"
className="form-control mb-3"
value={form.newPassword}
onChange={handleChange}
/>

<input
type="password"
name="confirmPassword"
placeholder="Confirm Password"
className="form-control mb-3"
value={form.confirmPassword}
onChange={handleChange}
/>

<button
className="btn btn-primary"
>
Change Password
</button>

</form>

</div>

  );

}

export default ChangePassword;