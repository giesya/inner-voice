(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();class T{constructor(e="https://story-api.dicoding.dev/v1"){this.apiBase=e}async getStories(e){return await(await fetch(`${this.apiBase}/stories?page=1&size=20&location=1`,{headers:e?{Authorization:"Bearer "+e}:{}})).json()}}class v{constructor(e,t){this.model=e,this.view=t,console.log("HomePresenter initialized with view:",t)}async loadStories(){try{this.view.showLoading();const e=localStorage.getItem("token");console.log("Fetching stories with token:",e);const t=await this.model.getStories(e);console.log("API response:",t),!t.error&&t.listStory?t.listStory.length===0?this.view.showError("Belum ada cerita yang ditambahkan."):this.view.renderStories(t.listStory):this.view.showError("Gagal memuat cerita: "+(t.message||"Unknown error"))}catch(e){console.error("Error saat memuat cerita:",e),this.view.showError("Terjadi kesalahan saat memuat cerita: "+e.message)}}logout(){try{localStorage.removeItem("token"),this.view&&typeof this.view.showSuccess=="function"?(this.view.showSuccess("Logout berhasil!"),this.view.redirectToHome()):(console.error("View or showSuccess method is not available"),alert("Logout berhasil!"),location.hash="#/")}catch(e){console.error("Error during logout:",e),this.view&&typeof this.view.showError=="function"?this.view.showError("Terjadi kesalahan saat logout"):(console.error("View or showError method is not available"),alert("Terjadi kesalahan saat logout"))}}}function I(n,e){const t=L.map(n).setView([-6.2088,106.8456],13),a={Default:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),Satellite:L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'&copy; <a href="https://www.esri.com/">Esri</a>'}),Terrain:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'})};return a.Default.addTo(t),L.control.layers(a).addTo(t),e.forEach(i=>{i.lat&&i.lon&&L.marker([i.lat,i.lon]).addTo(t).bindPopup(`
        <div class="popup-content">
          <img src="${i.photoUrl}" alt="Foto cerita ${i.name}" style="width: 100%; max-height: 150px; object-fit: cover; margin-bottom: 10px;">
          <h3>${i.name}</h3>
          <p>${i.description.substring(0,100)}${i.description.length>100?"...":""}</p>
          <a href="#/story/${i.id}" class="btn-detail">Lihat Detail</a>
        </div>
      `)}),t}function B(n,e){const t=L.map(n).setView([e.lat,e.lon],13),a={Default:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),Satellite:L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'&copy; <a href="https://www.esri.com/">Esri</a>'}),Terrain:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'})};return a.Default.addTo(t),L.control.layers(a).addTo(t),L.marker([e.lat,e.lon]).addTo(t).bindPopup(`
    <div class="popup-content">
      <img src="${e.photoUrl}" alt="Foto cerita ${e.name}" style="width: 100%; max-height: 150px; object-fit: cover; margin-bottom: 10px;">
      <h3>${e.name}</h3>
      <p>${e.description}</p>
    </div>
  `),t}function M(n,e){const t=L.map(n).setView([-6.2088,106.8456],13),a={Default:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),Satellite:L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'&copy; <a href="https://www.esri.com/">Esri</a>'}),Terrain:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'}),Dark:L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'})};a.Default.addTo(t),L.control.layers(a,null,{position:"topright",collapsed:!1}).addTo(t);const i=document.querySelector(".leaflet-control-layers");i&&(i.style.padding="10px",i.style.background="white",i.style.borderRadius="8px",i.style.boxShadow="0 2px 8px rgba(0,0,0,0.1)");let o=null;const r=document.getElementById(e);return t.on("click",m=>{const{lat:c,lng:p}=m.latlng;o&&t.removeLayer(o),o=L.marker([c,p]).addTo(t),o.bindPopup("Lokasi cerita Anda").openPopup(),r&&(r.textContent=`${c.toFixed(6)}, ${p.toFixed(6)}`)}),t.getSelectedLocation=()=>{if(o){const m=o.getLatLng();return{lat:m.lat,lon:m.lng}}return null},t}let h=!1;function C(n,e){const t=document.getElementById(n),a=document.getElementById(e);if(!t||!a){console.error("Image preview elements not found:",n,e);return}console.log("Setting up image preview for:",n),t.addEventListener("change",()=>{const i=t.files[0];if(i&&i.size<=1024*1024){const o=new FileReader;o.onload=()=>{a.style.opacity="0",a.src=o.result,a.style.display="block",a.onload=()=>{a.animate([{opacity:0},{opacity:1}],{duration:300,easing:"ease-out",fill:"forwards"})}},o.readAsDataURL(i)}else i&&(alert("File harus kurang dari 1MB"),t.value="",a.style.display="none")})}function b(n){return new Date(n).toLocaleString("id-ID",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}function E(n="maincontent"){if(h)return console.log("Transition already in progress, skipping"),Promise.resolve();console.log("Applying page transition effect"),h=!0;const e=document.getElementById(n);if(!e)return console.error(`Container with ID ${n} not found`),h=!1,Promise.resolve();if(document.startViewTransition)return new Promise(t=>{document.startViewTransition(()=>(e.style.viewTransitionName="page",new Promise(a=>{requestAnimationFrame(()=>{a(),t()})}))).finished.then(()=>{e.style.viewTransitionName="",h=!1})});{document.documentElement.style.willChange="transform",e.style.willChange="transform";const t=e.animate([{opacity:.95,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],{duration:300,easing:"cubic-bezier(0.215, 0.61, 0.355, 1)",fill:"forwards"});return new Promise(a=>{t.onfinish=()=>{document.documentElement.style.willChange="auto",e.style.willChange="auto",h=!1,a()},t.oncancel=()=>{document.documentElement.style.willChange="auto",e.style.willChange="auto",h=!1,a()}})}}class D{constructor(){this.model=new T,this.presenter=new v(this.model,this)}showLoading(){const e=document.getElementById("maincontent");e&&(e.innerHTML=`
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Memuat cerita...</p>
        </div>
      `)}showError(e){alert(e)}showSuccess(e){alert(e)}redirectToHome(){location.hash="#/"}renderStories(e){const t=document.getElementById("maincontent");t&&(t.innerHTML=`
      <div class="stories-container home-content">
        <div class="stories-header">
          <h2>Daftar Cerita</h2>
          <div class="user-actions">
            ${localStorage.getItem("token")?`<button onclick="location.hash='#/add'" class="btn-primary">
                  <i class="fas fa-plus"></i> Tambah Cerita
                </button>
                <button onclick="this.presenter.logout()" class="btn-secondary">
                  <i class="fas fa-sign-out-alt"></i> Logout
                </button>`:`<button onclick="location.hash='#/login'" class="btn-primary">
                  <i class="fas fa-sign-in-alt"></i> Login
                </button>`}
          </div>
        </div>
        <div class="story-list">
          ${e.length===0?'<p class="no-stories">Belum ada cerita yang ditambahkan.</p>':e.map(a=>`
                <div class="story-card" onclick="location.hash='#/story/${a.id}'">
                  <div class="story-image">
                    <img src="${a.photoUrl}" alt="${a.name}" loading="lazy">
                  </div>
                  <div class="story-content">
                    <h3>${a.name}</h3>
                    <p>${a.description}</p>
                    <div class="story-meta">
                      <span><i class="fas fa-calendar"></i> ${b(a.createdAt)}</span>
                    </div>
                  </div>
                </div>
              `).join("")}
        </div>
        <div id="storyMap" class="story-map"></div>
      </div>
    `,e.length>0&&I("storyMap",e))}showHomeView(){this.showLoading(),this.presenter.loadStories()}}class x{constructor(e="https://story-api.dicoding.dev/v1"){this.apiBase=e}async addStory(e,t){try{return await(await fetch(`${this.apiBase}/stories`,{method:"POST",headers:{Authorization:`Bearer ${t}`},body:e})).json()}catch(a){return console.error("Error adding story:",a),{error:!0,message:a.message}}}}class k{constructor(e,t){this.model=e,this.view=t}async handleFormSubmit(e){try{const t=localStorage.getItem("token");if(!t){this.view.showError("Anda harus login untuk menambah cerita"),this.view.redirectToLogin();return}this.view.showLoading();const a=await this.model.addStory(e,t);console.log("API addStory response:",a),a.error?this.view.showError("Gagal mengirim cerita: "+(a.message||JSON.stringify(a))):(this.view.showSuccess("Cerita berhasil dikirim"),this.view.redirectToHome())}catch(t){console.error("Error submitting story:",t),this.view.showError("Terjadi kesalahan saat mengirim cerita: "+t.message)}finally{this.view.hideLoading()}}}class P{constructor(){this.model=new x,this.presenter=new k(this.model,this),this.mapInstance=null,this.cameraStream=null}showLoading(){const e=document.querySelector('button[type="submit"]');e&&(e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Mengirim...')}hideLoading(){const e=document.querySelector('button[type="submit"]');e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-paper-plane"></i> Kirim')}showError(e){alert(e)}showSuccess(e){alert(e)}redirectToLogin(){location.hash="#/login"}redirectToHome(){location.hash="#/"}async setupCamera(e){const t=document.getElementById("camera"),a=document.getElementById("capture"),i=document.getElementById(e);if(!t||!a||!i)return;t.style.display="block",a.style.display="inline-block",i.style.display="none";try{this.cameraStream=await navigator.mediaDevices.getUserMedia({video:!0}),t.srcObject=this.cameraStream,t.play()}catch(r){alert("Tidak dapat mengakses kamera: "+r.message),t.style.display="none",a.style.display="none";return}function o(r,m){const c=r.split(","),p=c[0].match(/:(.*?);/)[1],l=atob(c[1]);let d=l.length;const u=new Uint8Array(d);for(;d--;)u[d]=l.charCodeAt(d);return new File([u],m,{type:p})}return a.onclick=()=>{const r=document.createElement("canvas");r.width=t.videoWidth,r.height=t.videoHeight,r.getContext("2d").drawImage(t,0,0,r.width,r.height);const c=r.toDataURL("image/png");i.src=c,i.style.display="block",t.style.display="none",a.style.display="none",this.cameraStream&&this.cameraStream.getTracks().forEach(l=>l.stop());const p=document.getElementById("photo");if(p){const l=o(c,"camera-capture.png"),d=new DataTransfer;d.items.add(l),p.files=d.files}},()=>{this.cameraStream&&this.cameraStream.getTracks().forEach(r=>r.stop()),t.style.display="none",a.style.display="none"}}render(){console.log("Rendering add story view");const e=document.getElementById("maincontent");if(!e){console.error("Main content element not found");return}e.innerHTML="",E();const t=document.createElement("div");t.className="form-container",t.innerHTML=`
      <h2>Tambah Cerita Baru</h2>
      <form id="formAdd" novalidate>
        <div class="form-group">
          <label for="desc">Deskripsi Cerita</label>
          <textarea id="desc" required placeholder="Ceritakan pengalamanmu..."></textarea>
        </div>

        <div class="form-group">
          <label for="photo">Foto Cerita (maks 1MB)</label>
          <div class="photo-input-container">
            <input type="file" id="photo" accept="image/*" required />
            <button type="button" id="toggleCamera">Gunakan Kamera</button>
          </div>
          <div class="camera-container">
            <video id="camera" style="display: none;" width="320" height="240"></video>
            <button type="button" id="capture" style="display: none;">Ambil Foto</button>
          </div>
          <img id="preview" alt="Preview foto cerita" style="display: none; max-width: 100%; margin-top: 1rem; border-radius: 8px;" />
        </div>

        <div class="form-group">
          <label>Pilih Lokasi (opsional)</label>
          <p class="hint">Klik pada peta untuk menandai lokasi cerita</p>
          <div id="map"></div>
          <p>Lokasi terpilih: <span id="locDisplay">Tidak ada</span></p>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            <i class="fas fa-paper-plane"></i> Kirim
          </button>
          <button type="button" class="btn-secondary" onclick="location.hash='#/'">
            <i class="fas fa-times"></i> Batal
          </button>
        </div>
      </form>
    `,e.appendChild(t),C("photo","preview"),setTimeout(()=>{console.log("Initializing map for add view"),this.mapInstance=M("map","locDisplay")},100);let a=null;const i=document.getElementById("toggleCamera");i&&i.addEventListener("click",()=>{const r=document.querySelector(".camera-container");r&&(r.style.display!=="block"?(r.style.display="block",a=this.setupCamera("preview")):(r.style.display="none",a&&a()))});const o=document.getElementById("formAdd");o&&o.addEventListener("submit",async r=>{r.preventDefault(),await this.handleFormSubmit()})}async handleFormSubmit(){console.log("Handling form submission");const e=document.getElementById("desc"),t=document.getElementById("photo");if(!e||!t){console.error("Form elements not found");return}const a=e.value.trim(),i=t.files[0];if(!a){this.showError("Deskripsi cerita harus diisi"),e.focus();return}if(!i){this.showError("Foto cerita harus dipilih");return}if(i.size>1024*1024){this.showError("Ukuran foto maksimal 1MB");return}const o=new FormData;if(o.append("description",a),o.append("photo",i),this.mapInstance&&typeof this.mapInstance.getSelectedLocation=="function"){const r=this.mapInstance.getSelectedLocation();r&&r.lat!==void 0&&r.lon!==void 0&&(o.append("lat",r.lat),o.append("lon",r.lon))}await this.presenter.handleFormSubmit(o)}destroy(){this.cameraStream&&(this.cameraStream.getTracks().forEach(e=>e.stop()),this.cameraStream=null),this.mapInstance&&(this.mapInstance.remove(),this.mapInstance=null)}}class H{constructor(e="https://story-api.dicoding.dev/v1"){this.apiBase=e}async getStoryDetail(e,t){return await(await fetch(`${this.apiBase}/stories/${e}`,{headers:t?{Authorization:"Bearer "+t}:{}})).json()}}class A{constructor(){this.model=new H,this.presenter=null}showLoading(){const e=document.getElementById("maincontent");e&&(e.innerHTML=`
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Memuat detail cerita...</p>
        </div>
      `)}showError(e){alert(e)}renderStoryDetail(e){const t=document.getElementById("maincontent");t&&(t.innerHTML=`
      <div class="story-detail-container">
        <button class="back-button" onclick="location.hash='#/'">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>

        <div class="story-detail-content">
          <div class="story-detail-header">
            <h2>${e.name}</h2>
            <div class="story-meta">
              <span><i class="fas fa-user"></i> ${e.name}</span>
              <span><i class="fas fa-calendar-alt"></i> ${b(e.createdAt)}</span>
            </div>
          </div>

          <div class="story-detail-body">
            <div class="story-image-container">
              <img src="${e.photoUrl}" alt="Foto cerita ${e.name}" class="detail-image" loading="lazy">
            </div>
            
            <div class="story-description">
              <p>${e.description}</p>
            </div>
          </div>

          <div class="story-location-section">
            <h3><i class="fas fa-map-marker-alt"></i> Lokasi Cerita</h3>
            <div id="map" class="story-map"></div>
          </div>
        </div>
      </div>
    `,e.lat&&e.lon&&B("map",e))}showDetailView(e){this.showLoading(),this.presenter.loadStoryDetail(e)}}class ${constructor(e,t){if(!t)throw new Error("View is required for DetailPresenter");this.model=e,this.view=t,console.log("DetailPresenter initialized with view:",t)}async loadStoryDetail(e){try{console.log("Loading story detail for ID:",e);const t=localStorage.getItem("token"),a=await this.model.getStoryDetail(e,t);a.error?this.view&&typeof this.view.showError=="function"?this.view.showError("Gagal memuat detail cerita: "+a.message):(console.error("View or showError method is not available"),alert("Gagal memuat detail cerita: "+a.message)):this.view&&typeof this.view.renderStoryDetail=="function"?this.view.renderStoryDetail(a.story):(console.error("View or renderStoryDetail method is not available"),alert("Gagal menampilkan detail cerita"))}catch(t){console.error("Error in loadStoryDetail:",t),this.view&&typeof this.view.showError=="function"?this.view.showError("Terjadi kesalahan saat memuat detail cerita"):(console.error("View or showError method is not available"),alert("Terjadi kesalahan saat memuat detail cerita"))}}}class j{constructor(e="https://story-api.dicoding.dev/v1"){this.apiBase=e}async login(e,t){return await(await fetch(`${this.apiBase}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})})).json()}async register(e,t,a){return await(await fetch(`${this.apiBase}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:a})})).json()}}class O{constructor(){this.model=new j,this.presenter=null}showError(e){alert(e)}showSuccess(e){alert(e)}redirectToHome(){location.hash="#/"}switchToLoginTab(e){const t=document.getElementById("tab-login"),a=document.getElementById("login-email");t&&a&&(t.click(),a.value=e)}render(){console.log("Rendering login view");const e=document.getElementById("maincontent");if(!e){console.error("Main content element not found");return}e.innerHTML="",E();const t=document.createElement("div");t.className="auth-container";const a=document.createElement("div");a.className="auth-tabs",a.innerHTML=`
      <button id="tab-login" class="auth-tab active">Login</button>
      <button id="tab-register" class="auth-tab">Daftar</button>
    `,t.appendChild(a);const i=document.createElement("form");i.id="formLogin",i.className="auth-form active",i.innerHTML=`
      <h2>Login</h2>
      
      <div class="form-group">
        <label for="login-email">Email</label>
        <input type="email" id="login-email" required placeholder="email@example.com" />
      </div>
      
      <div class="form-group">
        <label for="login-pass">Password</label>
        <input type="password" id="login-pass" required placeholder="Masukkan password" />
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
        <button type="button" class="btn-secondary" onclick="location.hash='#/'">
          <i class="fas fa-times"></i> Batal
        </button>
      </div>
    `,t.appendChild(i);const o=document.createElement("form");o.id="formRegister",o.className="auth-form",o.style.display="none",o.innerHTML=`
      <h2>Daftar Akun Baru</h2>
      
      <div class="form-group">
        <label for="register-name">Nama</label>
        <input type="text" id="register-name" required placeholder="Nama lengkap" />
      </div>
      
      <div class="form-group">
        <label for="register-email">Email</label>
        <input type="email" id="register-email" required placeholder="email@example.com" />
      </div>
      
      <div class="form-group">
        <label for="register-pass">Password</label>
        <input type="password" id="register-pass" required placeholder="Minimal 8 karakter" minlength="8" />
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <i class="fas fa-user-plus"></i> Daftar
        </button>
        <button type="button" class="btn-secondary" onclick="location.hash='#/'">
          <i class="fas fa-times"></i> Batal
        </button>
      </div>
    `,t.appendChild(o),e.appendChild(t);const r=this;document.getElementById("tab-login").addEventListener("click",()=>{document.getElementById("tab-login").classList.add("active"),document.getElementById("tab-register").classList.remove("active"),document.getElementById("formLogin").style.display="block",document.getElementById("formRegister").style.display="none"}),document.getElementById("tab-register").addEventListener("click",()=>{document.getElementById("tab-login").classList.remove("active"),document.getElementById("tab-register").classList.add("active"),document.getElementById("formLogin").style.display="none",document.getElementById("formRegister").style.display="block"}),document.getElementById("formLogin").addEventListener("submit",async m=>{m.preventDefault();const c=document.getElementById("login-email").value.trim(),p=document.getElementById("login-pass").value.trim();if(!c||!p){r.showError("Email dan password harus diisi");return}const l=m.target.querySelector('button[type="submit"]');l.disabled=!0,l.innerHTML='<i class="fas fa-spinner fa-spin"></i> Memproses...';try{await r.presenter.handleLogin(c,p)}catch(d){console.error("Error during login:",d),r.showError("Terjadi kesalahan saat login")}finally{l.disabled=!1,l.innerHTML='<i class="fas fa-sign-in-alt"></i> Login'}}),document.getElementById("formRegister").addEventListener("submit",async m=>{m.preventDefault();const c=document.getElementById("register-name").value.trim(),p=document.getElementById("register-email").value.trim(),l=document.getElementById("register-pass").value.trim();if(!c||!p||!l){r.showError("Semua field harus diisi");return}if(l.length<8){r.showError("Password minimal 8 karakter");return}const d=m.target.querySelector('button[type="submit"]');d.disabled=!0,d.innerHTML='<i class="fas fa-spinner fa-spin"></i> Memproses...';try{await r.presenter.handleRegister(c,p,l)}catch(u){console.error("Error during registration:",u),r.showError("Terjadi kesalahan saat registrasi")}finally{d.disabled=!1,d.innerHTML='<i class="fas fa-user-plus"></i> Daftar'}})}showLoginView(){this.render()}}class V{constructor(e,t){if(!t)throw new Error("View is required for LoginPresenter");this.model=e,this.view=t,console.log("LoginPresenter initialized with view:",t)}async handleLogin(e,t){try{const a=await this.model.login(e,t);a.error?this.view.showError("Login gagal: "+a.message):(localStorage.setItem("token",a.loginResult.token),this.view.showSuccess("Login berhasil!"),this.view.redirectToHome())}catch(a){console.error("Error in handleLogin:",a),this.view.showError("Terjadi kesalahan saat login")}}async handleRegister(e,t,a){try{const i=await this.model.register(e,t,a);i.error?this.view.showError("Registrasi gagal: "+i.message):(this.view.showSuccess("Registrasi berhasil! Silakan login."),this.view.switchToLoginTab(t))}catch(i){console.error("Error in handleRegister:",i),this.view.showError("Terjadi kesalahan saat registrasi")}}}const g=new D,f=new P,y=new A,w=new O,z=new v(g.model,g),F=new k(f.model,f),q=new $(y.model,y),R=new V(w.model,w);g.presenter=z;f.presenter=F;y.presenter=q;w.presenter=R;let s=null;function N(){document.querySelectorAll("video").forEach(e=>{e.srcObject&&(e.srcObject.getTracks().forEach(t=>t.stop()),e.srcObject=null)})}window.Camera={stopAllStreams:N};window.addEventListener("hashchange",async()=>{window.Camera.stopAllStreams(),S()});function S(){const e=(window.location.hash||"#/").slice(1);s&&typeof s.destroy=="function"&&(console.log("Cleaning up current view:",s.constructor.name),s.destroy());const t=document.getElementById("maincontent");if(t&&(t.innerHTML=`
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Memuat halaman...</p>
      </div>
    `),e==="/")s=g,s.showHomeView();else if(e==="/add")s=f,s.render();else if(e==="/login")s=w,s.render();else if(e.startsWith("/story/")){const a=e.split("/")[2];s=y,s.render(a)}else t.innerHTML=`
      <div class="error-container">
        <h2>404 - Halaman Tidak Ditemukan</h2>
        <p>Halaman yang Anda cari tidak ditemukan.</p>
        <button onclick="location.hash='#/'">Kembali ke Beranda</button>
      </div>
    `}function U(){console.log("Initializing app...");const n=document.createElement("style");n.textContent=`
    .page-transition {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    .page-transition.active {
      opacity: 1;
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }
    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,document.head.appendChild(n);const e=document.querySelector("main");e&&(e.classList.add("page-transition"),e.offsetHeight,e.classList.add("active")),document.addEventListener("visibilitychange",()=>{document.hidden&&s&&typeof s.destroy=="function"&&(console.log("Page hidden, cleaning up current view:",s.constructor.name),s.destroy())}),console.log("Running initial route..."),S()}document.addEventListener("DOMContentLoaded",U);
