import { EDecoratorKeyConvert } from '../../constant/decorator.constants';

import { IAutoConvertDefaultValue } from './../interfaces/decorator.interface';

function autoConvertDecoratorHandle(
  target: Object,
  propertyKey: string,
  key: EDecoratorKeyConvert,
) {
  const meta = Reflect.getMetadata(key, target) as string[];
  if (!meta) {
    return Reflect.defineMetadata(key, [propertyKey], target);  //Nếu không có metadata nào được lưu trữ cho key, nghĩa là đây là lần đầu tiên chúng ta đang cố gắng lưu trữ metadata cho key này, chúng ta sẽ tạo một mảng mới chứa propertyKey và lưu trữ nó dưới dạng metadata bằng cách sử dụng Reflect.defineMetadata.
  }
  if (!meta.includes(propertyKey)) {
    meta.push(propertyKey);
  }
}

export function AutoConvertNumber(_target: Object) { //Khi bạn sử dụng một decorator như @AutoConvertArrayString, nó sẽ được gọi với hai đối số: target và propertyKey. Trong đó, target đại diện cho constructor của class chứa trường được đánh dấu, và propertyKey là tên của trường đó. Trong hàm decorator, chúng ta có thể sử dụng _target để tham chiếu đến constructor của class và thực hiện các thao tác cần thiết dựa trên đó.
  return function (target: any, propertyKey: string) { //Trong TypeScript, decorator được áp dụng trực tiếp lên một trường của một class. Khi bạn sử dụng một decorator như @AutoConvertArrayString, nó được áp dụng cho một trường cụ thể trong class, và TypeScript cung cấp tên của trường đó cho hàm decorator như một đối số.
    autoConvertDecoratorHandle(
      _target,
      propertyKey,
      EDecoratorKeyConvert.NUMBER,
    );
  };
}

export function AutoConvertBoolean(_target: Object) {
  return function (target: any, propertyKey: string) {
    autoConvertDecoratorHandle(
      _target,
      propertyKey,
      EDecoratorKeyConvert.BOOLEAN,
    );
  };
}

export function AutoConvertArrayNumber(_target: Object) {
  return function (target: any, propertyKey: string) {
    autoConvertDecoratorHandle(
      _target,
      propertyKey,
      EDecoratorKeyConvert.ARRAY_NUMBER,
    );
  };
}

export function AutoConvertArrayString(_target: Object) {
  return function (target: any, propertyKey: string) {
    autoConvertDecoratorHandle(
      _target,
      propertyKey,
      EDecoratorKeyConvert.ARRAY_STRING,
    );
  };
}

export function DefaultValue(_target: Object, defaultValue: any) {
  return function (target: any, propertyKey: string) {
    const meta = Reflect.getMetadata(
      EDecoratorKeyConvert.DEFAULT_VALUE,
      _target,
    ) as IAutoConvertDefaultValue[];
    if (!meta) {
      return Reflect.defineMetadata(
        EDecoratorKeyConvert.DEFAULT_VALUE,
        [
          {
            key: propertyKey,
            defaultValue: defaultValue,
          } as IAutoConvertDefaultValue,
        ],
        _target,
      );
    }
    if (!meta.some(data => data.key === propertyKey)) {
      meta.push({
        key: propertyKey,
        defaultValue: defaultValue,
      } as IAutoConvertDefaultValue);
    }
  };
}


//Đoạn code trên định nghĩa một số decorators (AutoConvertNumber, AutoConvertBoolean, AutoConvertArrayNumber, AutoConvertArrayString, DefaultValue) và một hàm (autoConvertDecoratorHandle) để xử lý các decorator này.

// Các decorators này được sử dụng để đánh dấu các trường trong class DTO để chỉ ra rằng các giá trị của các trường đó cần được chuyển đổi sang các loại dữ liệu cụ thể khi nhận request từ client.

// Ví dụ, khi bạn áp dụng decorator AutoConvertNumber lên một trường của class DTO, decorator sẽ gọi hàm autoConvertDecoratorHandle để đánh dấu trường đó cần được chuyển đổi sang kiểu số (number). Tương tự, các decorator khác cũng có chức năng tương tự.

// Như vậy, các decorators này không trực tiếp liên quan đến ConvertHttpQueryPipe, nhưng chúng đóng vai trò quan trọng trong việc định dạng dữ liệu của request, và ConvertHttpQueryPipe có thể sử dụng các thông tin này để thực hiện chuyển đổi dữ liệu khi cần thiết.

// Dưới đây là một ví dụ minh họa về cách sử dụng các decorators này trong một class DTO:

// import { AutoConvertNumber, AutoConvertArrayString, DefaultValue } from './decorators';

// export class MyDTO {
//   @AutoConvertNumber
//   myNumber: number;

//   @AutoConvertArrayString
//   myArray: string[];

//   @DefaultValue(MyDTO, 'default value')
//   myFieldWithDefault: string;
// }
// Trong ví dụ trên, các trường myNumber sẽ được chuyển đổi sang kiểu số, myArray sẽ được chuyển đổi sang một mảng các chuỗi, và myFieldWithDefault sẽ có giá trị mặc định 'default value' nếu không có giá trị được gửi trong request.