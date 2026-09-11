document.addEventListener("DOMContentLoaded", () => {
    // 1. Logic chuyển tab (Giữ nguyên như cũ)
    const menuLinks = document.querySelectorAll("#menu a");
    const sections = document.querySelectorAll(".content-section");

    menuLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            menuLinks.forEach(item => item.classList.remove("active"));
            this.classList.add("active");
            const targetId = this.getAttribute("data-target");
            sections.forEach(section => {
                section.classList.toggle("active", section.id === targetId);
            });
        });
    });

    // 2. Tải dữ liệu từ Backend (data.json)
    fetchDataAndRender();
});

async function fetchDataAndRender() {
    try {
        // GỌI API (ở đây là file json)
        const response = await fetch('data.json');
        const data = await response.json();

        renderIOT(data.iot);
        renderEmbedded(data.embedded);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

// Hàm render dự án IOT
function renderIOT(projects) {
    const container = document.getElementById("iot-container");
    let html = '';
    projects.forEach(project => {
        html += `
            <div class="glass-card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                ${project.hasFlasher ? `
                <div class="flash-area">
                    <p class="warning">Cắm cáp USB vào bo mạch trước khi nạp!</p>
                    <esp-web-install-button manifest="${project.manifest}"></esp-web-install-button>
                </div>` : ''}
            </div>
        `;
    });
    container.innerHTML = html;
}

// Hàm render dự án Nhúng (phức tạp hơn, có features và steps)
function renderEmbedded(projects) {
    const container = document.getElementById("embedded-container");
    let html = '';
    
    projects.forEach(project => {
        // Build HTML cho danh sách tính năng
        let featuresHTML = project.features ? project.features.map(f => 
            `<li style="background: rgba(0,0,0,0.3); padding: 0.8rem; border-radius: 6px;">${f}</li>`
        ).join('') : '';

        // Build HTML cho các bước
        let stepsHTML = '';
        if (project.steps) {
            project.steps.forEach((step, index) => {
                stepsHTML += `
                <div class="glass-card" style="margin-top: 1rem;">
                    <h4 style="color: #ff7300;">Bước ${index + 1}: ${step.stepTitle}</h4>
                    <p>${step.content}</p>
                    ${step.code ? `<code style="display:block; background:#000; padding:0.8rem; color:#3fb950; margin-top:0.8rem; border-radius:6px; white-space: pre-wrap;">${step.code}</code>` : ''}
                    ${step.link ? `<a href="${step.link.url}" class="btn-outline">${step.link.text}</a>` : ''}
                </div>`;
            });
        }

        // Ghép toàn bộ lại thành Component
        html += `
            <div class="glass-card" style="margin-bottom: 2rem; border-left: 3px solid #ff7300;">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <ul style="list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    ${featuresHTML}
                </ul>
            </div>
            <div class="embedded-steps">
                ${stepsHTML}
            </div>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 3rem 0;">
        `;
    });
    
    container.innerHTML = html;
}
