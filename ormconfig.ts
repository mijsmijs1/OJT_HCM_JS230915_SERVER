/* eslint-disable @typescript-eslint/no-var-requires */
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy; // và tạo một instance của nó. SnakeNamingStrategy là một chiến lược đặt tên cho các bảng và cột trong cơ sở dữ liệu, trong đó sử dụng kiểu snake_case.
const config: MysqlConnectionOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  type: 'mysql',
  database: process.env.DB_NAME || 'database-name',
  entities: [__dirname + '/**/**/**/*.entity{.ts,.js}'], //entities: [__dirname + '/**/**/**/*.entity{.ts,.js}']: Đây là cách TypeORM tìm kiếm và xác định các entities trong ứng dụng. Trong đó:// __dirname: Biến toàn cục trong Node.js, đại diện cho đường dẫn thư mục hiện tại của file JavaScript.// /**/**/**/*.entity{.ts,.js }: Một biểu thức chính quy (glob pattern) cho phép TypeORM tìm kiếm các file.entity.ts hoặc.entity.js trong tất cả các thư mục con của thư mục hiện tại.Điều này cho phép TypeORM tìm thấy và tải các file entity mà bạn đã định nghĩa trong ứng dụng của mình.Entity là các đối tượng JavaScript đại diện cho các bảng trong cơ sở dữ liệu.
  synchronize: true, //Tùy chọn này khi được đặt thành true, TypeORM sẽ tự động tạo hoặc cập nhật cấu trúc của cơ sở dữ liệu để phản ánh các thay đổi trong các entities. Nói cách khác, khi các entities của bạn thay đổi (ví dụ: thêm, sửa hoặc xóa trường), TypeORM sẽ tự động ánh xạ các thay đổi này vào cơ sở dữ liệu.
  namingStrategy: new SnakeNamingStrategy(), //Đây là chiến lược đặt tên cho các bảng và cột trong cơ sở dữ liệu. Trong trường hợp này, SnakeNamingStrategy() được sử dụng để đảm bảo rằng các tên bảng và cột được đặt theo kiểu snake_case (ví dụ: user_table thay vì UserTable). Chiến lược này làm cho việc đọc và hiểu cấu trúc cơ sở dữ liệu dễ dàng hơn và thường được ưa chuộng trong các ứng dụng phát triển bằng JavaScript và Node.js.
};
//Khai báo biến config với các tùy chọn kết nối cơ sở dữ liệu MySQL. Điều này bao gồm thông tin về máy chủ, cổng, tên người dùng, mật khẩu, tên cơ sở dữ liệu, và các entities (thực thể) được TypeORM sử dụng để tạo bảng trong cơ sở dữ liệu. Cấu hình cũng bao gồm cài đặt synchronize để đồng bộ hóa cấu trúc cơ sở dữ liệu với các entities được xác định, và sử dụng SnakeNamingStrategy đã được khai báo trước đó.
export default config;