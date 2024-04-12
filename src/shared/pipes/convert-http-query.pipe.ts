import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

import { EDecoratorKeyConvert } from '../../constant/decorator.constants';

import { IAutoConvertDefaultValue } from './../interfaces/decorator.interface';

@Injectable()
export class ConvertHttpQueryPipe implements PipeTransform<any> {
  private _convertNumber: string[];
  private _convertBoolean: string[];
  private _convertArrayNumber: string[];
  private _convertArrayString: string[];
  private _convertDefaultValue: IAutoConvertDefaultValue[];

  constructor(targetDto: Object) {
    this._convertNumber = Reflect.getMetadata( //Trong đoạn mã trên, Reflect.getMetadata được sử dụng để lấy các thông tin được đặt metadata trong decorator từ targetDto. Cụ thể, nó đang lấy metadata có key là EDecoratorKeyConvert.NUMBER từ targetDto.
      EDecoratorKeyConvert.NUMBER,
      targetDto,
    );
    this._convertBoolean = Reflect.getMetadata(
      EDecoratorKeyConvert.BOOLEAN,
      targetDto,
    );
    this._convertArrayNumber = Reflect.getMetadata(
      EDecoratorKeyConvert.ARRAY_NUMBER,
      targetDto,
    );
    this._convertArrayString = Reflect.getMetadata(
      EDecoratorKeyConvert.ARRAY_STRING,
      targetDto,
    );
    this._convertDefaultValue = Reflect.getMetadata(
      EDecoratorKeyConvert.DEFAULT_VALUE,
      targetDto,
    );
  }
  //CHỗ này sẽ nhận và truy xét tất cả trường hợp được gửi từ AutoConvertNumber, AutoConvertBoolean, AutoConvertArrayNumber, AutoConvertArrayString, và DefaultValue, 
  // qua, và dùng điều kiện if (!listRequireData || !listRequireData.length) {
  //   return;
  // } để validate nếu không có EDecoratorKeyConvert truyền qua
  async transform(value: any, { type }: ArgumentMetadata) {
    if (type === 'body') {
      return value;
    }

    // convert
    convertToNumber(this._convertNumber, value);
    convertToBoolean(this._convertBoolean, value);
    convertToArrayNumber(this._convertArrayNumber, value);
    convertToArrayString(this._convertArrayString, value);
    applyDefaultValue(this._convertDefaultValue, value);

    return value;
  }
}

function convertToNumber(listRequireData: string[], value: Object) {
  if (!listRequireData || !listRequireData.length) {
    return;
  }
  for (const key of listRequireData) {
    if (value[key] !== undefined) { //phần từ trong object value sẽ có key tên là 1 phần tử trong listRequireData
      value[key] = +value[key];
    }
  }
}

function convertToBoolean(listRequireData: string[], value: Object) {
  if (!listRequireData || !listRequireData.length) {
    return;
  }
  for (const key of listRequireData) {
    if (value[key] !== undefined) {
      value[key] = !!+value[key];
    }
  }
}

function convertToArrayNumber(listRequireData: string[], value: Object) {
  if (!listRequireData || !listRequireData.length) {
    return;
  }
  for (const key of listRequireData) {
    if (value[key] !== undefined) {
      if (typeof value[key] === 'string') {
        value[key] = [+value[key]];
        continue;
      }
      value[key] = (value[key] as any[]).map(data => +data);
    }
  }
}

function convertToArrayString(listRequireData: string[], value: Object) {
  if (!listRequireData || !listRequireData.length) {
    return;
  }
  for (const key of listRequireData) {
    if (value[key] !== undefined && typeof value[key] === 'string') {
      value[key] = [value[key]];
    }
  }
}

function applyDefaultValue(
  listRequireData: IAutoConvertDefaultValue[],
  value: Object,
) {
  if (!listRequireData || !listRequireData.length) {
    return;
  }
  for (const { key, defaultValue } of listRequireData) {
    if (value[key] === undefined) {
      value[key] = defaultValue;
    }
  }
}


// ConvertHttpQueryPipe được sử dụng để chuyển đổi các giá trị trong request HTTP trước khi chúng được xử lý bởi các endpoint trong ứng dụng. Dưới đây là một số lợi ích của việc sử dụng pipe này và hậu quả của việc không sử dụng:

// Tác dụng và lợi ích của ConvertHttpQueryPipe:
// Chuẩn hóa dữ liệu đầu vào: Pipe giúp chuẩn hóa dữ liệu đầu vào từ request HTTP, đảm bảo rằng các giá trị được chuyển đổi đúng kiểu và định dạng trước khi được sử dụng bởi các handler hoặc controller.

// Dễ dàng quản lý và duy trì: Pipe cho phép tách biệt logic chuyển đổi dữ liệu ra khỏi logic xử lý chính của ứng dụng, giúp dễ dàng quản lý và duy trì mã nguồn.

// Tăng khả năng tái sử dụng: Bằng cách tách biệt logic chuyển đổi vào một pipe riêng biệt, bạn có thể tái sử dụng pipe này trong nhiều endpoint khác nhau mà không cần phải viết lại logic chuyển đổi.

// Giảm lỗi và tăng tin cậy: Việc chuyển đổi dữ liệu trước khi xử lý giúp giảm nguy cơ lỗi do dữ liệu không hợp lệ hoặc không chính xác.

// Hậu quả của việc không sử dụng ConvertHttpQueryPipe:
// Rủi ro dữ liệu không hợp lệ: Nếu không có logic chuyển đổi được áp dụng, các giá trị từ request HTTP có thể không được đúng định dạng hoặc kiểu dữ liệu mong đợi, gây ra lỗi hoặc kết quả không chính xác trong quá trình xử lý.

// Mã nguồn khó hiểu và khó duy trì: Việc xử lý logic chuyển đổi trong từng handler hoặc controller có thể làm cho mã nguồn trở nên phức tạp, khó hiểu và khó duy trì.

// Khó tái sử dụng: Logic chuyển đổi được phân tán trong các phần của ứng dụng, làm giảm khả năng tái sử dụng và tái sử dụng logic chuyển đổi.

//Pipe ConvertHttpQueryPipe trong đoạn mã trên được sử dụng để chuyển đổi các giá trị được gửi trong request HTTP. Đây là một pipe tùy chỉnh, được thiết kế để thực hiện các chức năng chuyển đổi dựa trên các thông tin được đánh dấu trong decorator.

// Dưới đây là cách pipe này hoạt động:

// Khởi tạo: Pipe nhận một đối tượng targetDto trong constructor, đại diện cho DTO (Data Transfer Object) liên quan đến request hiện tại. Pipe sử dụng các thông tin trong targetDto để biết cần chuyển đổi các trường nào.

// Lấy thông tin từ Decorator: Pipe sử dụng Reflect.getMetadata() để lấy các thông tin chuyển đổi từ các decorator đã được đánh dấu trên DTO. Các thông tin này bao gồm các trường cần chuyển đổi thành kiểu số, kiểu boolean, mảng số, mảng chuỗi và giá trị mặc định.

// Chuyển đổi giá trị: Sau khi lấy được các thông tin chuyển đổi, pipe tiến hành chuyển đổi giá trị của các trường tương ứng trong request HTTP. Các chức năng chuyển đổi được thực hiện bao gồm:

// Chuyển đổi thành kiểu số (convertToNumber()).
// Chuyển đổi thành kiểu boolean (convertToBoolean()).
// Chuyển đổi thành mảng số (convertToArrayNumber()).
// Chuyển đổi thành mảng chuỗi (convertToArrayString()).
// Áp dụng giá trị mặc định nếu trường không tồn tại (applyDefaultValue()).
// Trả về kết quả: Cuối cùng, pipe trả về giá trị đã được chuyển đổi để sử dụng cho xử lý tiếp theo trong ứng dụng.

// Pipe này giúp tạo ra một luồng xử lý linh hoạt và tái sử dụng để chuyển đổi các giá trị trong request HTTP một cách dễ dàng và đồng nhất.





// @Controller('example')
// export class ExampleController {
//   @Get()
//   @UsePipes(new ConvertHttpQueryPipe())
//   async getExample(@Query() query: any) {
//     // Xử lý logic của route tại đây
//     return query;
//   }
// }
