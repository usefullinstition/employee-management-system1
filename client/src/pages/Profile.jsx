import { useNavigate } from "react-router-dom";


function Profile(){

const user = JSON.parse(
 localStorage.getItem("user")
);


return (

<div className="container mt-4">


<h2>
My Profile
</h2>


<div className="card p-4">

<h4>
Name:
</h4>

<p>
{user?.name}
</p>


<h4>
Email:
</h4>

<p>
{user?.email}
</p>


<h4>
Role:
</h4>

<p>
{user?.role}
</p>


</div>


</div>

);

}


export default Profile;