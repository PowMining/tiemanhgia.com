document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll("#menu a");
    const sections = document.querySelectorAll(".content-section");

    menuLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            // 1. Gỡ bỏ active khỏi tất cả các tab menu
            menuLinks.forEach(item => item.classList.remove("active"));
            
            // 2. Thêm active vào tab vừa click
            this.classList.add("active");

            // 3. Lấy ID của section cần hiển thị
            const targetId = this.getAttribute("data-target");

            // 4. Ẩn tất cả section và hiện section được chọn
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add("active");
                } else {
                    section.classList.remove("active");
                }
            });
            
            // (Tùy chọn) Cập nhật URL trên trình duyệt để khi copy link vẫn vào đúng trang
            // Sử dụng History API
            window.history.pushState(null, '', `#${targetId}`);
        });
    });

    // Check URL hash lúc tải trang để hiển thị đúng mục nếu người dùng F5 hoặc truy cập link trực tiếp
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // bỏ dấu #
        const activeLink = document.querySelector(`#menu a[data-target="${hash}"]`);
        if (activeLink) {
            activeLink.click();
        }
    }
});
