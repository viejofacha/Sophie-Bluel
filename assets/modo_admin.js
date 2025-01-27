const authToken = localStorage.getItem("authToken");
  if (authToken) {
    enableAdminMode();
  } else {
    loadPage("home"); // Carga la página principal para usuarios normales
  }


let token = localStorage.getItem("authToken");

if (token) {
  console.log(token);
  let adminBar = document.querySelector(".edition");
  adminBar.innerHTML = `<img class="group_3" src="assets/icons/Group 3.png">`;
  let addBtn = document.querySelector("#add-work-btn");
  addBtn.style.display = "block";
  
      
}
// if (token) {
// let adminModal = document.querySelector("#modal");
//   adminModal.innerHTML = ` <div class="modal-content">
//         <span>
//           <a href="Hompage_edit.html"><img src="assets/icons/xmark.png" required/></a>
//         </span>
//           <p>Galerie photo</p>
//         <div id="modal-gallery" class="modal-gallery">
//           </div>
//         <section>
//           <img class="line" src="assets/icons/Line 1.png" />
//         </section>
//         <div> <a class="ajouter-btn" href="Hompage_edit_2.html">Ajouter une photo</a>
//         </div>
//       </div>`;
// }
// if (token) {
// let adminUploadModal = document.querySelector("#upload-modal");
//       adminModal.innerHTML = ` <div class="modal-content">
//         <ul>
//           <li class="arrow-left">
//             <a href="Hompage_edit_1.html"
//               ><img src="assets/icons/arrow-left.png"
//             /></a>
//           </li>
//           <li class="xmark">
//             <a href="Hompage_edit.html"><img src="assets/icons/xmark.png" /></a>
//           </li>
//         </ul>
//         <p>Ajout photo</p>
//         <form id="upload-form">
//           <div class="form-group">
//             <div>
//               <img class="vector-photo" src="assets/icons/vector-photo.png" />
//             </div>
//             <div>
              
//                 <label for="photo-upload"><text>+ Ajouter photo</text></label>
//                 <input type="file" id="photo-upload" name="photo" accept="image/png, image/jpeg" required/>
              
//             </div>
//             <div class="texto"><small>jpg, png : 4mo max</small></div>
//           </div>
//           <section>
          
//           <div class="form-group1">
//             <label for="title">Titre</label>
//             <input type="text" id="title" name="title" placeholder="" />
//           </div>
//         </section>
//         <section>
          
//           <div class="form-group2">
//             <label for="category">Catégorie</label>
//             <select id="category" name="category" required>
//               <option value="" disabled selected></option>
//             </select>
//           </div>
//         </section>  
//           <div>
//             <img class="line" src="assets/icons/Line 1.png" />
//           </div>
//           <div>
//             <button class="valider-btn" type="submit" id="submit-btn">
//               Valider
//             </button>
//           </div>
//         </form>
//       </div>`;
// }