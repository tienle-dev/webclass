document.addEventListener("DOMContentLoaded", function () {
    const cartShowBtn = document.querySelector(".fa-cart-arrow-down");
    const cartCloseBtn = document.querySelector(".fa-times");
    const cartContainer = document.querySelector(".cart");

    cartShowBtn.addEventListener("click", function () {
        cartContainer.style.right = "0";
    });

    cartCloseBtn.addEventListener("click", function () {
        cartContainer.style.right = "-100%";
    });

    const buyNowButtons = document.querySelectorAll("#btnThemVaoGioHang");

    // Lặp qua từng nút và thêm sự kiện click
    buyNowButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            // Ngăn chặn hành vi mặc định của thẻ a (chuyển hướng trang)
            event.preventDefault();

            // Lấy thông tin sản phẩm từ phần tử chứa sản phẩm
            const productContainer = button.closest(".wrapper");
            const productName = productContainer.querySelector(".product-title").textContent;
            const productPrice = productContainer.querySelector("span").textContent;
            const productImg = productContainer.querySelector("img").src;

            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            if (isProductInCart(productName)) {
                alert("Sản phẩm đã có trong giỏ hàng. Vui lòng kiểm tra giỏ hàng.");
                return;
            }

            // Tạo đối tượng sản phẩm
            const product = {
                name: productName,
                price: parseFloat(productPrice.replace("đ", "").replace(",", "")), // Chuyển giá thành số
                quantity: 1,
                img: productImg,
            };

            // Thêm sản phẩm vào giỏ hàng
            addToCart(product);
            // Hiển thị thông báo
            alert(`${productName} đã được thêm vào giỏ hàng thành công!`);
        });
    });

    // Chức năng thêm sản phẩm vào giỏ hàng
    function addToCart(product) {
        // Lấy thông tin giỏ hàng từ localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingProductIndex = cart.findIndex((item) => item.name === product.name);

        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            cart[existingProductIndex].quantity += 1;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng
            cart.push(product);
        }

        // Lưu lại giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Cập nhật số lượng sản phẩm trên biểu tượng giỏ hàng
        updateCartBadge(cart.length);

        // Hiển thị thông tin sản phẩm trong giỏ hàng
        displayProductInCart(product);
    }

    // Chức năng cập nhật số lượng sản phẩm trên biểu tượng giỏ hàng
    function updateCartBadge(quantity) {
        const cartBadge = document.querySelector(".badge");
        if (cartBadge) {
            cartBadge.textContent = quantity;
        }
    }

    // Chức năng hiển thị thông tin sản phẩm trong giỏ hàng
    function displayProductInCart(product) {
        // Lấy phần tử chứa thông tin giỏ hàng
        const cartContainer = document.querySelector(".cart-container");

        // Tạo phần tử cho sản phẩm mới
        const productElement = document.createElement("tr");
        productElement.innerHTML = `
<td><img style="width: 70px" src="${product.img}"></td>
<td>${product.name}</td>
<td>${product.price * 1000}<sup>đ</sup></td>
<td><input style="width: 30px; outline: none;" type="number" value="${product.quantity}" min="1"></td>
<td style="cursor: pointer;" class="remove-product">xóa</td>
`;

        // Thêm sản phẩm vào giỏ hàng
        cartContainer.appendChild(productElement);

        // Bắt sự kiện xóa khi nút được click
        const removeButton = productElement.querySelector(".remove-product");
        removeButton.addEventListener("click", function () {
            // Gọi hàm để xóa sản phẩm khỏi giỏ hàng
            removeFromCart(product);
            // Xóa sản phẩm khỏi giao diện giỏ hàng
            cartContainer.removeChild(productElement);
            // Cập nhật tổng tiền
            updateTotal();
        });
        // Bắt sự kiện khi giá trị trên input thay đổi
        const quantityInput = productElement.querySelector("input");
        quantityInput.addEventListener("change", function () {
            // Gọi hàm để cập nhật số lượng sản phẩm trong giỏ hàng
            updateQuantity(product, quantityInput.value);

            // Cập nhật tổng tiền
            updateTotal();
        });

        // Cập nhật tổng tiền khi thêm sản phẩm mới
        updateTotal();
    }

    // Chức năng xóa sản phẩm khỏi giỏ hàng
    function removeFromCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProductIndex = cart.findIndex((item) => item.name === product.name);

        if (existingProductIndex !== -1) {
            const currentQuantity = cart[existingProductIndex].quantity;

            // Trừ giá sản phẩm theo số lượng
            cart[existingProductIndex].price -= cart[existingProductIndex].price;
            cart[existingProductIndex].quantity -= cart[existingProductIndex].quantity;

            // Nếu số lượng = 1, xóa sản phẩm khỏi giỏ hàng
            cart.splice(existingProductIndex, 1);

            // Lưu lại giỏ hàng vào localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Cập nhật số lượng sản phẩm trên biểu tượng giỏ hàng
            updateCartBadge(cart.length);
        }
    }

    function updateQuantity(product, newQuantity) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProductIndex = cart.findIndex((item) => item.name === product.name);

        if (existingProductIndex !== -1) {
            // Đảm bảo giá trị mới là số nguyên lớn hơn 0
            const quantity = parseInt(newQuantity);
            if (quantity > 0) {
                cart[existingProductIndex].quantity = quantity;

                // Lưu lại giỏ hàng vào localStorage
                localStorage.setItem("cart", JSON.stringify(cart));

                // Cập nhật số lượng sản phẩm trên biểu tượng giỏ hàng
                updateCartBadge(cart.length);
            }
        }
    }
    // Chức năng cập nhật tổng tiền
    function updateTotal() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalAmount = 0;

        // Tính tổng tiền
        cart.forEach((product) => {
            totalAmount += product.price * product.quantity * 1000;
        });

        // Hiển thị tổng tiền trên giao diện
        const totalAmountElement = document.querySelector(".total-amount");
        if (totalAmountElement) {
            totalAmountElement.textContent = totalAmount.toLocaleString(); // Format số tiền
        }
    }


    const checkoutButton = document.querySelector(".checkout-button");

    // Bắt sự kiện click trên nút "Chốt đơn"
    checkoutButton.addEventListener("click", function () {
        // Lấy thông tin giỏ hàng từ localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Kiểm tra xem giỏ hàng có sản phẩm không
        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi xem chi tiết.");
            return;
        }

        // Gửi thông tin đơn hàng (cart) lên server hoặc xử lý theo yêu cầu của bạn
        // Ở đây, chúng ta chỉ hiển thị thông báo đơn giản
        //alert("Đơn hàng của bạn đã được chốt thành công!");

        // Sau khi chốt đơn, xóa thông tin giỏ hàng từ localStorage và cập nhật giao diện
        localStorage.removeItem("cart");
        updateCartBadge(0);
        updateTotal();

        // Đóng cửa sổ giỏ hàng (nếu muốn)
        const cartContainer = document.querySelector(".cart");
        cartContainer.style.right = "-100%";
        // Ngăn chặn hành vi mặc định của thẻ a (chuyển hướng trang)
        event.preventDefault();
        // Chuyển hướng đến trang thanh toán
        window.location.href = "../pages/gio hang.html";
    });
    // Chức năng kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    function isProductInCart(productName) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        return cart.some((item) => item.name === productName);
    }
})