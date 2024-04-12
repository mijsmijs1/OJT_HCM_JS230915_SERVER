Luồng chạy Docker

# Base image (phiên bản node chạy trong docker)
FROM node:18

# Create app directory Hướng dẫn này thiết lập thư mục làm việc trong container Docker là /usr/src/app. Các tệp và thư mục tiếp theo sẽ được sao chép hoặc tạo trong thư mục này.
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied Hướng dẫn này sao chép tệp package.json và package-lock.json từ máy host vào thư mục làm việc của container Docker. Điều này cho phép Docker sử dụng các phụ thuộc được định nghĩa trong package.json để cài đặt các gói npm cần thiết.
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source Hướng dẫn này sao chép tất cả các tệp và thư mục từ máy host vào thư mục làm việc của container Docker. Điều này bao gồm mã nguồn của ứng dụng Node.js.
COPY . .

# Creates a "dist" folder with the production build Hướng dẫn này sao chép tất cả các tệp và thư mục từ máy host vào thư mục làm việc của container Docker. Điều này bao gồm mã nguồn của ứng dụng Node.js.
RUN npm run build

# Start the server using the production build Hướng dẫn này xác định lệnh mặc định mà container Docker sẽ thực thi khi nó được khởi động. Trong trường hợp này, nó là lệnh để khởi động ứng dụng Node.js, với file chính là main.js trong thư mục dist.
CMD [ "node", "dist/main.js" ]



# Khi bạn chỉ có một file Dockerfile trong dự án của mình và muốn xây dựng một hình ảnh Docker từ đó trên một máy Linux, có một số bước bạn cần thực hiện:

# Cài đặt Docker: Đảm bảo rằng Docker đã được cài đặt trên máy Linux của bạn. Nếu chưa, bạn có thể cài đặt Docker bằng cách thực hiện các bước trong tài liệu hướng dẫn chính thức của Docker cho Linux.
#  Đảm bảo Docker đang chạy: Trước khi bạn có thể sử dụng Docker, hãy chắc chắn rằng dịch vụ Docker đang chạy trên máy của bạn. Bạn có thể kiểm tra điều này bằng cách chạy lệnh sau trong terminal:

#         sudo systemctl status docker
# Nếu dịch vụ Docker đang chạy, bạn sẽ thấy thông báo trạng thái là "active (running)".

# Thực hiện xây dựng hình ảnh Docker: Sau khi bạn đã cài đặt và đảm bảo rằng Docker đang chạy, bạn có thể thực hiện lệnh docker build để xây dựng hình ảnh Docker từ Dockerfile của bạn. Chạy lệnh sau trong thư mục chứa Dockerfile và mã nguồn của bạn:
#         docker build -t <tên_hình_ảnh> .
# Đảm bảo thay thế <tên_hình_ảnh> bằng tên bạn muốn đặt cho hình ảnh Docker của mình.

# Nếu bạn thực hiện các bước trên đúng cách, Docker sẽ sử dụng Dockerfile của bạn để tạo ra một hình ảnh Docker và bạn có thể sử dụng nó để chạy container. Bạn không cần thiết lập bất kỳ điều gì khác trong dự án của mình liên quan đến Docker.
# Chạy container Docker: Sau khi xây dựng hình ảnh Docker, bạn có thể chạy container Docker từ hình ảnh đó bằng cách sử dụng lệnh sau:
#     docker run -d -p <cổng_host>:<cổng_container> <tên_hình_ảnh>
# Trong đó:

#         <cổng_host> là cổng trên máy host mà bạn muốn ánh xạ đến cổng của container.
#         <cổng_container> là cổng mà ứng dụng của bạn lắng nghe trong container Docker.
#         <tên_hình_ảnh> là tên của hình ảnh Docker mà bạn đã xây dựng ở bước trước.
#         Truy cập ứng dụng của bạn: Sau khi chạy container Docker, ứng dụng của bạn sẽ được triển khai và sẵn sàng hoạt động. Bạn có thể truy cập vào ứng dụng của mình thông qua trình duyệt web bằng cách nhập URL http://localhost:<cổng_host> trong trường hợp bạn đã ánh xạ cổng host đến cổng container, hoặc http://localhost:<cổng_container> nếu bạn muốn truy cập trực tiếp vào cổng container.
        
#         Quá trình này cho phép bạn triển khai ứng dụng của mình trong một môi trường Docker, cung cấp tính di động và khả năng tái sử dụng, và đảm bảo rằng ứng dụng của bạn sẽ chạy như mong đợi trên bất kỳ máy chủ nào hỗ trợ Docker.
