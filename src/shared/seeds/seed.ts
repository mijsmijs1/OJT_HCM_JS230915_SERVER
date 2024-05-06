import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account_Company } from "src/modules/company/database/account_company.entity";
import { Company } from "src/modules/company/database/company.entity";
import { Type_Company } from "src/modules/company/database/type_company.entity";
import { LevelJob } from "src/modules/job/database/levelJob.entity";
import { TypeJob } from "src/modules/job/database/typeJob.entity";
import { Repository } from "typeorm";
import { SecureUtils } from "../utils";
import { CompanyService } from "src/modules/company/company.service";
import { JobService } from "src/modules/job/job.service";
import { Job } from "src/modules/job/database/job.entity";

@Injectable()
export class DefaultEntriesService {
    constructor(
        @InjectRepository(TypeJob)
        private readonly typeJobRepository: Repository<TypeJob>,
        @InjectRepository(LevelJob)
        private readonly levelJobRepository: Repository<LevelJob>,
        @InjectRepository(Type_Company)
        private readonly TypeCompanyRepository: Repository<Type_Company>,
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
        @InjectRepository(Account_Company)
        private readonly accountCompanyRepository: Repository<Account_Company>,
        private readonly companyService: CompanyService,
        private readonly jobService: JobService,
    ) { }
    async createDefaultTypeJob() {
        try {
            const typeJobNames = [
                'JavaScript', 'TypeScript', 'ReactJS', 'Java', 'NodeJS', 'NestJS', 'Python', 'Ruby', 'PHP', 'C#', 'C++', 'Swift', 'Kotlin', 'Go', 'Rust', 'Scala', 'Perl',
                'Shell Scripting', '.NET', 'Angular', 'Vue.js', 'Django', 'Flask', 'Laravel', 'Ruby on Rails', 'Express.js', 'ASP.NET',
                'Spring Boot', 'Hibernate', 'SQL Server', 'PostgreSQL', 'MongoDB', 'Oracle', 'Firebase', 'Docker', 'Kubernetes', 'AWS',
                'Azure', 'Google Cloud', 'DevOps', 'Agile', 'Scrum', 'Kanban', 'CI/CD', 'Git', 'SVN', 'Jira', 'Trello', 'Linux', 'Unix',
                'Windows Server', 'Cybersecurity', 'Machine Learning', 'Data Science', 'AI', 'Big Data', 'Hadoop', 'Spark', 'TensorFlow',
                'Blockchain'
            ];
            const existingTypeJob = await this.typeJobRepository.findOne({ where: { name: typeJobNames[0] } });
            if (!existingTypeJob) {
                for (const name of typeJobNames) {
                    const typeJob = this.typeJobRepository.create({ name });
                    await this.typeJobRepository.save(typeJob);
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async createDefaultLevelJob() {
        try {
            const levelJobNames = [
                'Intern', 'Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager'
            ];
            const existingLevelJob = await this.levelJobRepository.findOne({ where: { name: levelJobNames[0] } });
            if (!existingLevelJob) {
                for (const name of levelJobNames) {
                    const levelJob = this.levelJobRepository.create({ name });
                    await this.levelJobRepository.save(levelJob);
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async createDefaultTypeCompany() {
        try {
            const typeCompanyNames = [
                'Outsource', 'Product', 'Startups', 'Service', 'R&D', 'Hardware'
            ];
            const existingTypeCompany = await this.TypeCompanyRepository.findOne({ where: { name: typeCompanyNames[0] } });
            if (!existingTypeCompany) {
                for (const name of typeCompanyNames) {
                    const typeCompany = this.TypeCompanyRepository.create({ name });
                    await this.TypeCompanyRepository.save(typeCompany);
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async createDefaultCompanyAccount() {
        try {
            let result = null;
            let password = await SecureUtils.hashPassword('123456')
            const companyAccount = {
                email: 'nguyphuquy6@gmail.com',
                password,
                email_status: true
            };
            const existingCompanyAccount = await this.accountCompanyRepository.findOne({ where: { email: companyAccount.email } });
            if (!existingCompanyAccount) {
                result = await this.accountCompanyRepository.save(companyAccount)
            }
            const companyData = [{
                "phone": "0936549721",
                "email": "FPT@gmail.com",
                "name": "FPT Software",
                "account_company_id": result?.id,
                "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/2560px-FPT_logo_2010.svg.png",
                "size": "1001-5000 nhân viên",
                "description": "Tập đoàn FPT (tiếng Anh: FPT Corporation), tên chính thức là Công ty Cổ phần FPT, được biết đến rộng rãi dưới cái tên FPT, là công ty thuộc top 20 doanh nghiệp tư nhân lớn nhất tại Việt Nam,[1] với ba lĩnh vực kinh doanh cốt lõi gồm: Công nghệ, Viễn thông và Giáo dục. Ngày 13 tháng 9 năm 1988, FPT được thành lập với tên gọi Công ty Công nghệ Thực phẩm hoạt động trong lĩnh vực công nghệ sấy, công nghệ thông tin, công nghệ tự động hóa. (Chữ gốc FPT ban đầu có nghĩa là The Food Processing Technology Company - Công ty Công nghệ Thực phẩm).Ngày 27 tháng 10 năm 1990, được đổi tên thành The Corporation for Financing Promoting Technology - Công ty Đầu tư và Phát triển Công nghệ với hoạt động kinh doanh cốt lõi là CNTT.[2] Năm 1998, FPT trở thành 1 trong 4 nhà cung cấp dịch vụ Internet đầu tiên tại Việt Nam, tạo bước phát triển đột phá cho lĩnh vực này tại Việt Nam.",
                "type_company_id": 1,
                "link_fb": "facebook.com",
                "link_linkedin": "link_linkedin.com",
                "website": "FPT.com"
            },
            {
                "phone": "0912345678",
                "email": "VinFast@gmail.com",
                "name": "VinFast",
                "account_company_id": result?.id,
                "logo": "https://inkythuatso.com/uploads/images/2021/10/logo-vinfast-inkythuatso-21-11-08-55.jpg",
                "size": "Trên 5000 nhân viên",
                "description": "VinFast là một công ty sản xuất ô tô hàng đầu tại Việt Nam. Công ty này là một phần của Tập đoàn Vingroup và được biết đến với việc sản xuất các dòng xe hơi điện và xe máy tại Việt Nam.",
                "type_company_id": 1,
                "link_fb": "facebook.com/VinFast",
                "link_linkedin": "linkedin.com/company/vinfast",
                "website": "vinfast.vn"
            },
            {
                "phone": "0987654321",
                "email": "FPT_Information_System@gmail.com",
                "name": "FPT Information System",
                "account_company_id": result?.id,
                "logo": "https://live.staticflickr.com/4647/24601173027_508d6f8fc0_b.jpg",
                "size": "1001-5000 nhân viên",
                "description": "FPT Information System (FPT IS) là một công ty cung cấp dịch vụ và giải pháp công nghệ thông tin hàng đầu tại Việt Nam. FPT IS tập trung vào việc cung cấp các giải pháp phần mềm doanh nghiệp và dịch vụ phát triển ứng dụng.",
                "type_company_id": 1,
                "link_fb": "facebook.com/FPTInformationSystem",
                "link_linkedin": "linkedin.com/company/fpt-information-system",
                "website": "fpt-is.com.vn"
            },
            {
                "phone": "0901234567",
                "email": "Viettel_Telecom@gmail.com",
                "name": "Viettel Telecom",
                "account_company_id": result?.id,
                "logo": "https://viettel.com.vn/media/viettel/cache/a7/6e/a76ef7a0b3a4b0c29819d3b93798baa7.webp",
                "size": "Trên 5000 nhân viên",
                "description": "Viettel Telecom là một trong những công ty viễn thông lớn nhất tại Việt Nam, là một phần của Tập đoàn Công nghiệp - Viễn thông Quân đội. Viettel Telecom cung cấp dịch vụ viễn thông di động và cố định, dịch vụ Internet, và nhiều dịch vụ khác.",
                "type_company_id": 1,
                "link_fb": "facebook.com/Viettel",
                "link_linkedin": "linkedin.com/company/viettel",
                "website": "viettel.com.vn"
            },
            {
                "phone": "0976543210",
                "email": "Bkav_Corporation@gmail.com",
                "name": "Bkav Corporation",
                "account_company_id": result?.id,
                "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Logo_Bkav.svg/1200px-Logo_Bkav.svg.png",
                "size": "1001-5000 nhân viên",
                "description": "Bkav Corporation là một công ty công nghệ hàng đầu tại Việt Nam, chuyên trong lĩnh vực an ninh mạng và phần mềm diệt virus. Bkav được biết đến với phần mềm diệt virus Bkav và các giải pháp an ninh mạng cho doanh nghiệp và người dùng cá nhân.",
                "type_company_id": 1,
                "link_fb": "facebook.com/BkavCorporation",
                "link_linkedin": "linkedin.com/company/bkav-corporation",
                "website": "bkav.com.vn"
            },
            {
                "phone": "0965432109",
                "email": "MBBanks@gmail.com",
                "name": "MBBank",
                "account_company_id": result?.id,
                "logo": "https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png",
                "size": "Trên 5000 nhân viên",
                "description": "MBBank, hay còn gọi là Ngân hàng TMCP Quân đội (MB), là một trong những ngân hàng lớn nhất tại Việt Nam. MBBank cung cấp các sản phẩm và dịch vụ ngân hàng cho cá nhân và doanh nghiệp, bao gồm tài khoản, thẻ tín dụng, vay vốn, và nhiều dịch vụ khác.",
                "type_company_id": 1,
                "link_fb": "facebook.com/MBBank",
                "link_linkedin": "linkedin.com/company/mbbank",
                "website": "mbbank.com.vn"
            },
            {
                "phone": "0918765432",
                "email": "Vietnam_Airlines@gmail.com",
                "name": "Vietnam Airlines",
                "account_company_id": result?.id,
                "logo": "https://careerfinder.vn/wp-content/uploads/2020/05/vietnam-airline-logo.jpg",
                "size": "Trên 5000 nhân viên",
                "description": "Vietnam Airlines là hãng hàng không quốc gia của Việt Nam, cung cấp các dịch vụ bay quốc tế và nội địa. Vietnam Airlines là một trong những hãng hàng không lớn nhất tại Đông Nam Á và có mạng lưới bay rộng khắp trên thế giới.",
                "type_company_id": 1,
                "link_fb": "facebook.com/VietnamAirlines",
                "link_linkedin": "linkedin.com/company/vietnam-airlines",
                "website": "vietnamairlines.com"
            },
            {
                "phone": "0978563412",
                "email": "Sun_Group@gmail.com",
                "name": "Sun Group",
                "account_company_id": result?.id,
                "logo": "https://saigonrealestate.vn/wp-content/uploads/2020/10/Sun-Group-logo.png",
                "size": "Trên 5000 nhân viên",
                "description": "Sun Group là một tập đoàn đa ngành tại Việt Nam, hoạt động trong lĩnh vực bất động sản, du lịch, giải trí, và nhiều lĩnh vực khác. Sun Group được biết đến với việc phát triển các dự án du lịch nghỉ dưỡng và giải trí lớn tại Việt Nam.",
                "type_company_id": 1,
                "link_fb": "facebook.com/SunGroup",
                "link_linkedin": "linkedin.com/company/sun-group",
                "website": "sungroup.com.vn"
            },
            {
                "phone": "0945678901",
                "email": "Zalo_Technology@gmail.com",
                "name": "Zalo Technology",
                "account_company_id": result?.id,
                "logo": "https://seeklogo.com/images/Z/zalo-logo-B0A0B2B326-seeklogo.com.png",
                "size": "501-1000 nhân viên",
                "description": "Zalo Technology là một công ty công nghệ hàng đầu tại Việt Nam, chuyên trong lĩnh vực phát triển ứng dụng di động và dịch vụ trò chơi trực tuyến. Công ty này là một phần của VNG Corporation và được biết đến với ứng dụng nhắn tin Zalo.",
                "type_company_id": 1,
                "link_fb": "facebook.com/Zalo",
                "link_linkedin": "linkedin.com/company/zalo-technology",
                "website": "zalo.me"
            },
            {
                "phone": "0932785643",
                "email": "Vietnam_Post@gmail.com",
                "name": "Vietnam Post",
                "account_company_id": result?.id,
                "logo": "https://inkythuatso.com/uploads/images/2021/12/logo-vnpost-inkythuatso-04-13-49-06.jpg",
                "size": "Trên 5000 nhân viên",
                "description": "Vietnam Post, hay còn gọi là Bưu điện Việt Nam, là một trong những tổng công ty bưu chính lớn nhất tại Việt Nam. Vietnam Post cung cấp các dịch vụ bưu chính, chuyển phát nhanh, và các dịch vụ vận chuyển hàng hóa trên toàn quốc.",
                "type_company_id": 1,
                "link_fb": "facebook.com/VietnamPost",
                "link_linkedin": "linkedin.com/company/vietnam-post",
                "website": "vietnampost.vn"
            },
            {
                "phone": "0987654321",
                "email": "VTC_Online@gmail.com",
                "name": "VTC Online",
                "account_company_id": result?.id,
                "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQffLXsydduepHUiW74Q80b6GAOFhxcQUmAJ9eU9qz0vg&s",
                "size": "501-1000 nhân viên",
                "description": "VTC Online là một phần của Tập đoàn Truyền thông và Giải trí Việt Nam (VTC), là một trong những công ty hàng đầu trong lĩnh vực truyền thông số và giải trí trực tuyến tại Việt Nam. VTC Online cung cấp các dịch vụ truyền thông số, truyền hình trực tuyến, và nhiều dịch vụ giải trí khác.",
                "type_company_id": 1,
                "link_fb": "facebook.com/VTCOnline",
                "link_linkedin": "linkedin.com/company/vtc-online",
                "website": "vtc.vn"
            },
            {
                "phone": "0912345678",
                "email": "VNG_Game@gmail.com",
                "name": "VNG Game",
                "account_company_id": result?.id,
                "logo": "https://vnggames.com/_next/image?url=https%3A%2F%2Fcdn.omnirise.com%2Fcms%2Fvnggames_logo_orange_black_stacked_ed2de4ce30.png&w=2560&q=100",
                "size": "1001-5000 nhân viên",
                "description": "VNG Game là một công ty hàng đầu trong lĩnh vực phát triển và phát hành trò chơi trực tuyến tại Việt Nam. Công ty này là một phần của VNG Corporation và được biết đến với các tựa game như Liên Minh Huyền Thoại (League of Legends) và PUBG Mobile.",
                "type_company_id": 1,
                "link_fb": "facebook.com/VNGGame",
                "link_linkedin": "linkedin.com/company/vng-game",
                "website": "vng.com.vn"
            },
            {
                "phone": "09876543211",
                "email": "Techcombank@gmail.com",
                "name": "Techcombank",
                "account_company_id": result?.id,
                "logo": "https://media.loveitopcdn.com/3807/thumb/logo-techcombank-dongphucsongphu.png",
                "size": "Trên 5000 nhân viên",
                "description": "Techcombank, hay còn gọi là Ngân hàng TMCP Kỹ Thương Việt Nam, là một trong những ngân hàng hàng đầu tại Việt Nam. Techcombank cung cấp các sản phẩm và dịch vụ ngân hàng cho cá nhân và doanh nghiệp, bao gồm tài khoản, thẻ tín dụng, vay vốn, và nhiều dịch vụ khác.",
                "type_company_id": 1,
                "link_fb": "facebook.com/Techcombank",
                "link_linkedin": "linkedin.com/company/techcombank",
                "website": "techcombank.com.vn"
            },
            {
                "phone": "0976543210",
                "email": "Vietnamworks@gmail.com",
                "name": "VietnamWorks",
                "account_company_id": result?.id,
                "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScOm_IVnnbxQ8-Di--GRz5m69XJApJJ-rU3vlOHaZZQA&s",
                "size": "1001-5000 nhân viên",
                "description": "VietnamWorks là một trong những trang web tuyển dụng hàng đầu tại Việt Nam, cung cấp các dịch vụ tìm kiếm việc làm cho người tìm việc và tuyển dụng. VietnamWorks được biết đến với cơ sở dữ liệu việc làm lớn và nhiều công cty đối tác.",
                "type_company_id": 1,
                "link_fb": "facebook.com/VietnamWorks",
                "link_linkedin": "linkedin.com/company/vietnamworks",
                "website": "vietnamworks.com"
            },
            {
                "phone": "0912345678",
                "email": "Lotte_Group@gmail.com",
                "name": "Lotte Group",
                "account_company_id": result?.id,
                "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTRnxEqaaa14R0vXNfJrKkNru0ypNo7d-FN2PgHBdUCA&s",
                "size": "Trên 5000 nhân viên",
                "description": "Lotte Group là một tập đoàn đa quốc gia có trụ sở tại Hàn Quốc, hoạt động trong nhiều lĩnh vực như bán lẻ, dịch vụ khách sạn, và sản xuất. Lotte Group có mặt tại nhiều quốc gia trên thế giới, bao gồm cả Việt Nam.",
                "type_company_id": 1,
                "link_fb": "facebook.com/LotteGroup",
                "link_linkedin": "linkedin.com/company/lotte-group",
                "website": "lotte.vn"
            },
            {
                "phone": "0987654321",
                "email": "Samsung_Vietnam@gmail.com",
                "name": "Samsung Vietnam",
                "account_company_id": result?.id,
                "logo": "https://www.elleman.vn/wp-content/uploads/2019/10/02/logo-thu%CC%9Bo%CC%9Bng-hie%CC%A3%CC%82u-samsung-hi%CC%80nh-elip.png",
                "size": "Trên 5000 nhân viên",
                "description": "Samsung Vietnam là một trong những cơ sở sản xuất của Samsung Electronics, một trong những công ty điện tử lớn nhất thế giới. Samsung Vietnam hoạt động trong lĩnh vực sản xuất điện tử tiêu dùng và linh kiện điện tử.",
                "type_company_id": 1,
                "link_fb": "facebook.com/SamsungVietnam",
                "link_linkedin": "linkedin.com/company/samsung-vietnam",
                "website": "samsung.com/vn"
            },
            {
                "phone": "0918765432",
                "email": "Masan_Group@gmail.com",
                "name": "Masan Group",
                "account_company_id": result?.id,
                "logo": "https://nhanlucnganhluat.vn/uploads/images/54D17A12/logo/2024-03/logo.jpg",
                "size": "Trên 5000 nhân viên",
                "description": "Masan Group là một tập đoàn đa ngành tại Việt Nam, hoạt động trong lĩnh vực sản xuất và bán lẻ thực phẩm. Masan Group có mặt trong nhiều lĩnh vực khác nhau bao gồm thực phẩm chế biến, bán lẻ, và dịch vụ tài chính.",
                "type_company_id": 1,
                "link_fb": "facebook.com/MasanGroup",
                "link_linkedin": "linkedin.com/company/masan-group",
                "website": "masan.com.vn"
            },
            {
                "phone": "0945678901",
                "email": "Tiki_Corporation@gmail.com",
                "name": "Tiki Corporation",
                "account_company_id": result?.id,
                "logo": "https://static.topcv.vn/company_logos/6YgPMQJY8tFn1UCPeDBUiFoWCfaITKiX_1641720785____0c58877dd49b7478d3430003cd60f259.png",
                "size": "1001-5000 nhân viên",
                "description": "Tiki Corporation, hay còn gọi là Công ty Cổ phần Ti Ki, là một trong những công ty bán lẻ trực tuyến hàng đầu tại Việt Nam. Tiki cung cấp một loạt các sản phẩm từ sách, đồ điện tử đến thực phẩm và đồ tiêu dùng cá nhân.",
                "type_company_id": 1,
                "link_fb": "facebook.com/Tiki.vn",
                "link_linkedin": "linkedin.com/company/tiki-corporation",
                "website": "tiki.vn"
            },
            {
                "phone": "0976543210",
                "email": "VinMart_Retail@gmail.com",
                "name": "VinMart Retail",
                "account_company_id": result?.id,
                "logo": "https://downloadlogomienphi.com/sites/default/files/logos/download-logo-vector-vinmart-mien-phi.jpg",
                "size": "Trên 5000 nhân viên",
                "description": "VinMart Retail là một trong những chuỗi siêu thị lớn nhất tại Việt Nam, là một phần của Tập đoàn Vingroup. VinMart Retail cung cấp các sản phẩm từ thực phẩm đến hàng tiêu dùng và đồ dùng gia đình.",
                "type_company_id": 1,
                "link_fb": "facebook.com/VinMart",
                "link_linkedin": "linkedin.com/company/vinmart-retail",
                "website": "vinmart.com"
            },
            {
                "phone": "0901234567",
                "email": "Viettel_Group@gmail.com",
                "name": "Viettel Group",
                "account_company_id": result?.id,
                "logo": "https://www.saokim.com.vn/blog/wp-content/uploads/2017/03/viettel-quy-hoach-tong-dai-cham-soc-khach-hang.jpg.webp",
                "size": "Trên 5000 nhân viên",
                "description": "Viettel Group, hay còn gọi là Tập đoàn Công nghiệp - Viễn thông Quân đội, là một trong những tập đoàn viễn thông lớn nhất tại Việt Nam. Viettel Group hoạt động trong lĩnh vực viễn thông, dịch vụ Internet, và nhiều lĩnh vực khác.",
                "type_company_id": 1,
                "link_fb": "facebook.com/Viettel",
                "link_linkedin": "linkedin.com/company/viettel",
                "website": "viettel.com.vn"
            },
            {
                "phone": "0978563412",
                "email": "Haivision_Technologies@gmail.com",
                "name": "Haivision Technologies",
                "account_company_id": result?.id,
                "logo": "https://s3-symbol-logo.tradingview.com/haivision-sys--600.png",
                "size": "501-1000 nhân viên",
                "description": "Haivision Technologies là một công ty công nghệ hàng đầu trong lĩnh vực video và truyền thông trực tuyến. Công ty này cung cấp các giải pháp video streaming, video encoding, và video management cho các doanh nghiệp và tổ chức.",
                "type_company_id": 1,
                "link_fb": "facebook.com/Haivision",
                "link_linkedin": "linkedin.com/company/haivision-technologies",
                "website": "haivision.com"
            },
            {
                "phone": "0945678901",
                "email": "VTV_Digital@gmail.com",
                "name": "VTV Digital",
                "account_company_id": result?.id,
                "logo": "https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-vtv-inklythuatso-01-22-10-26-12.jpg",
                "size": "Trên 5000 nhân viên",
                "description": "VTV Digital là một phần của Đài Truyền hình Việt Nam (VTV), là một trong những đài truyền hình lớn nhất tại Việt Nam. VTV Digital cung cấp các dịch vụ truyền hình kỹ thuật số và truyền hình trực tuyến cho khán giả trong và ngoài nước.",
                "type_company_id": 1,
                "link_fb": "facebook.com/VTV",
                "link_linkedin": "linkedin.com/company/vtv-digital",
                "website": "vtvdigital.vn"
            },
            {
                "phone": "0912345678",
                "email": "Bphone_Technology@gmail.com",
                "name": "Bphone Technology",
                "account_company_id": result?.id,
                "logo": "https://icolor.vn/wp-content/uploads/2021/04/Logo-Bphone-l%C3%A0m-kh%C3%B3-h%C6%A1n-so-v%E1%BB%9Bi-g%C3%B3c-si%C3%AAu-elip-c%E1%BB%A7a-logo-7-t%E1%BB%B7-%C4%91%E1%BB%93ng-3.png",
                "size": "1001-5000 nhân viên",
                "description": "Bphone Technology là một công ty công nghệ hàng đầu tại Việt Nam, chuyên trong lĩnh vực phát triển điện thoại di động và công nghệ di động. Công ty này được biết đến với dòng điện thoại thông minh Bphone và các sản phẩm công nghệ khác.",
                "type_company_id": 1,
                "link_fb": "facebook.com/Bphone",
                "link_linkedin": "linkedin.com/company/bphone-technology",
                "website": "bphone.vn"
            },
            {
                "phone": "0987654321",
                "email": "Gameloft_Vietnam@gmail.com",
                "name": "Gameloft Vietnam",
                "account_company_id": result?.id,
                "logo": "https://images.glints.com/unsafe/glints-dashboard.s3.amazonaws.com/company-logo/07c0632088d17d2299a6d2fa2a966ca7.png",
                "size": "1001-5000 nhân viên",
                "description": "Gameloft Vietnam là một phần của Gameloft, một trong những công ty hàng đầu trong lĩnh vực phát triển trò chơi di động trên toàn thế giới. Gameloft Vietnam chủ yếu phát triển trò chơi di động cho các nền tảng iOS và Android.",
                "type_company_id": 1,
                "link_fb": "facebook.com/GameloftVietnam",
                "link_linkedin": "linkedin.com/company/gameloft-vietnam",
                "website": "gameloft.com"
            },
            {
                "phone": "0901234567",
                "email": "Petrolimex_Corporation@gmail.com",
                "name": "Petrolimex Corporation",
                "account_company_id": result?.id,
                "logo": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_of_Petrolimex.svg",
                "size": "Trên 5000 nhân viên",
                "description": "Petrolimex Corporation, hay còn gọi là Tập đoàn Xăng dầu Việt Nam, là một trong những tập đoàn hàng đầu trong lĩnh vực năng lượng tại Việt Nam. Petrolimex cung cấp các sản phẩm xăng dầu và dịch vụ năng lượng cho người tiêu dùng và doanh nghiệp.",
                "type_company_id": 1,
                "link_fb": "facebook.com/Petrolimex",
                "link_linkedin": "linkedin.com/company/petrolimex-corporation",
                "website": "petrolimex.com.vn"
            },
            {
                "phone": "0912345678",
                "email": "Nam_A_Bank@gmail.com",
                "name": "Nam A Bank",
                "account_company_id": result?.id,
                "logo": "https://upload.wikimedia.org/wikipedia/commons/4/45/Nam_A_Bank_Logo.jpg",
                "size": "1001-5000 nhân viên",
                "description": "Nam A Bank, hay còn gọi là Ngân hàng TMCP Nam Á, là một trong những ngân hàng tư nhân hàng đầu tại Việt Nam. Nam A Bank cung cấp các sản phẩm và dịch vụ ngân hàng cho cá nhân và doanh nghiệp, bao gồm tài khoản, thẻ tín dụng, vay vốn, và nhiều dịch vụ khác.",
                "type_company_id": 1,
                "link_fb": "facebook.com/NamABank",
                "link_linkedin": "linkedin.com/company/nam-a-bank",
                "website": "namabank.com.vn"
            }
            ];
            let companies = []
            const existingCompany = await this.companyRepository.findOne({ where: { email: companyData[0].email } });
            if (!existingCompany) {
                for (let item of companyData) {
                    let company = await this.companyRepository.save(item)
                    await this.companyService.createAddress(company.id, { address: '43 Tự Cường, Phường Đồng Xuân, Quận Hoàn Kiếm, Thành phố Hà Nội', name: '43 Tự Cường, Phường Đồng Xuân, Quận Hoàn Kiếm, Thành phố Hà Nội' })
                    companies.push(company)
                }
            }
            let jobData = [
                {
                    "title": "React Developer",
                    "description": "Vị trí: React Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng React và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với React và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "1600$-1800$",
                    "created_at": "2024-05-05 11:40:39",
                    "expire_at": "2024-05-15 11:40:39",
                    "company_id": 1,
                    "location_name": "23 Hoàng Văn Thụ, Phường 9, Quận Phú Nhuận, Thành phố Hồ Chí Minh",
                    "typeJobs": [1, 2, 3],
                    "levelJob_id": 5
                },
                {
                    "title": "React Developer",
                    "description": "Vị trí: React Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng React và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với React và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 11:40:39",
                    "expire_at": "2024-05-15 11:40:39",
                    "company_id": 12,
                    "location_name": "55 Lê Lai, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh",
                    "typeJobs": [1, 2, 3],
                    "levelJob_id": 1
                },
                {
                    "title": "React Developer",
                    "description": "Vị trí: React Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng React và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với React và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "1000$",
                    "created_at": "2024-05-05 11:40:39",
                    "expire_at": "2024-05-15 11:40:39",
                    "company_id": 11,
                    "location_name": "51 Lê Lai, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh",
                    "typeJobs": [1, 2, 3],
                    "levelJob_id": 3
                },
                {
                    "title": "Java Developer",
                    "description": "Vị trí: Java Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Java và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Java và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "3000$",
                    "created_at": "2024-05-05 10:20:18",
                    "expire_at": "2024-05-15 10:20:18",
                    "company_id": 2,
                    "location_name": "72 Nguyễn Văn Linh, Phường Tân Thuận Tây, Quận 7, Thành phố Hồ Chí Minh",
                    "typeJobs": [4, 28, 30],
                    "levelJob_id": 6
                },
                {
                    "title": "Java Developer",
                    "description": "Vị trí: Java Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Java và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Java và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "200$",
                    "created_at": "2024-05-05 10:20:18",
                    "expire_at": "2024-05-15 10:20:18",
                    "company_id": 20,
                    "location_name": "101 Trần Hưng Đạo, Phường Phước Ninh, Quận Hải Châu, Thành phố Đà Nẵng",
                    "typeJobs": [4, 28, 30],
                    "levelJob_id": 1
                },
                {
                    "title": "Java Developer",
                    "description": "Vị trí: Java Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Java và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Java và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "500$",
                    "created_at": "2024-05-05 10:20:18",
                    "expire_at": "2024-05-15 10:20:18",
                    "company_id": 15,
                    "location_name": "32 Hưng Vương, Phường An Hòa, Quận Ninh Kiều, Thành phố Cần Thơ",
                    "typeJobs": [4, 28, 30],
                    "levelJob_id": 2
                },
                {
                    "title": "Java Developer",
                    "description": "Vị trí: Java Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Java và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Java và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 10:20:18",
                    "expire_at": "2024-05-15 10:20:18",
                    "company_id": 4,
                    "location_name": "15 Ngô Thì Sĩ, Phường Lộc Thọ, Thành phố Nha Trang, Tỉnh Khánh Hòa",
                    "typeJobs": [4, 28, 30],
                    "levelJob_id": 2
                },
                {
                    "title": "C# Developer",
                    "description": "Vị trí: C# Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng C# và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với C# và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "200$",
                    "created_at": "2024-05-05 08:55:37",
                    "expire_at": "2024-05-15 08:55:37",
                    "company_id": 3,
                    "location_name": "81 Đinh Tiên Hoàng, Phường Đông Hải 1, Quận Hồng Bàng, Thành phố Hải Phòng",
                    "typeJobs": [10, 30],
                    "levelJob_id": 1
                },
                {
                    "title": "C# Developer",
                    "description": "Vị trí: C# Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng C# và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với C# và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "3000$",
                    "created_at": "2024-05-05 08:55:37",
                    "expire_at": "2024-05-15 08:55:37",
                    "company_id": 11,
                    "location_name": "88 Tân Định, Phường 3, Quận 1, Thành phố Hồ Chí Minh",
                    "typeJobs": [10, 30, 37],
                    "levelJob_id": 6
                },
                {
                    "title": "C# Developer",
                    "description": "Vị trí: C# Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng C# và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với C# và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "400$",
                    "created_at": "2024-05-05 08:55:37",
                    "expire_at": "2024-05-15 08:55:37",
                    "company_id": 13,
                    "location_name": "17 Hoàng Diệu, Phường 10, Quận Phú Nhuận, Thành phố Hồ Chí Minh",
                    "typeJobs": [10, 30],
                    "levelJob_id": 2
                },
                {
                    "title": "Python Developer",
                    "description": "Vị trí: Python Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Python và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Python và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 07:30:52",
                    "expire_at": "2024-05-15 07:30:52",
                    "company_id": 2,
                    "location_name": "39 Lê Duẩn, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
                    "typeJobs": [7, 30, 32],
                    "levelJob_id": 2
                },
                {
                    "title": "Python Developer",
                    "description": "Vị trí: Python Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Python và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Python và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 07:30:52",
                    "expire_at": "2024-05-15 07:30:52",
                    "company_id": 17,
                    "location_name": "7 Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
                    "typeJobs": [7, 30, 32],
                    "levelJob_id": 5
                },
                {
                    "title": ".NET Developer",
                    "description": "Vị trí: .NET Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng .NET và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với .NET và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "1000$-1200$",
                    "created_at": "2024-05-05 06:15:23",
                    "expire_at": "2024-05-15 06:15:23",
                    "company_id": 4,
                    "location_name": "20 Võ Văn Tần, Phường 6, Quận 3, Thành phố Hồ Chí Minh",
                    "typeJobs": [19, 37, 49],
                    "levelJob_id": 5
                },
                {
                    "title": ".NET Developer",
                    "description": "Vị trí: .NET Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng .NET và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với .NET và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "100$-200$",
                    "created_at": "2024-05-05 06:15:23",
                    "expire_at": "2024-05-15 06:15:23",
                    "company_id": 14,
                    "location_name": "46 Nguyễn Thái Học, Phường Phước Ninh, Quận Hải Châu, Thành phố Đà Nẵng",
                    "typeJobs": [19, 37, 49],
                    "levelJob_id": 1
                },
                {
                    "title": ".NET Developer",
                    "description": "Vị trí: .NET Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng .NET và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với .NET và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 06:15:23",
                    "expire_at": "2024-05-15 06:15:23",
                    "company_id": 5,
                    "location_name": "92 Lê Lợi, Phường Cái Khế, Quận Ninh Kiều, Thành phố Cần Thơ",
                    "typeJobs": [19, 37, 49],
                    "levelJob_id": 5
                },
                {
                    "title": "Vue.js Developer",
                    "description": "Vị trí: Vue.js Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Vue.js và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Vue.js và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 05:05:47",
                    "expire_at": "2024-05-15 05:05:47",
                    "company_id": 6,
                    "location_name": "51 Nguyễn Bỉnh Khiêm, Phường Lộc Thọ, Thành phố Nha Trang, Tỉnh Khánh Hòa",
                    "typeJobs": [21, 1, 2],
                    "levelJob_id": 1
                },
                {
                    "title": "Vue.js Developer",
                    "description": "Vị trí: Vue.js Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Vue.js và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Vue.js và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 05:05:47",
                    "expire_at": "2024-05-15 05:05:47",
                    "company_id": 6,
                    "location_name": "62 Hàng Bài, Phường Hàng Bài, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [21, 1, 2],
                    "levelJob_id": 5
                },
                {
                    "title": "Django Developer",
                    "description": "Vị trí: Django Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Django và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Django và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "700$-900$",
                    "created_at": "2024-05-05 04:00:21",
                    "expire_at": "2024-05-16 04:00:21",
                    "company_id": 7,
                    "location_name": "77 Hàng Đào, Phường Hàng Đào, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [11, 22],
                    "levelJob_id": 3
                },
                {
                    "title": "Angular Developer",
                    "description": "Vị trí: Angular Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Angular và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Angular và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "900$",
                    "created_at": "2024-05-05 02:45:45",
                    "expire_at": "2024-05-17 02:45:45",
                    "company_id": 8,
                    "location_name": "29 Hàng Bồ, Phường Hàng Bồ, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [1, 2, 20],
                    "levelJob_id": 3
                },
                {
                    "title": "Angular Developer",
                    "description": "Vị trí: Angular Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Angular và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Angular và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "100$",
                    "created_at": "2024-05-05 02:45:45",
                    "expire_at": "2024-05-17 02:45:45",
                    "company_id": 18,
                    "location_name": "50 Hàng Buồm, Phường Hàng Buồm, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [1, 2, 20],
                    "levelJob_id": 1
                },
                {
                    "title": "Flask Developer",
                    "description": "Vị trí: Flask Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Flask và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Flask và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "2000$",
                    "created_at": "2024-05-05 01:35:58",
                    "expire_at": "2024-05-18 01:35:58",
                    "company_id": 9,
                    "location_name": "18 Hàng Tre, Phường Hàng Tre, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [23],
                    "levelJob_id": 5
                },
                {
                    "title": "Laravel Developer",
                    "description": "Vị trí: Laravel Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Laravel và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Laravel và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 00:25:11",
                    "expire_at": "2024-05-19 00:25:11",
                    "company_id": 10,
                    "location_name": "37 Hàng Mành, Phường Hàng Mành, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [24, 37],
                    "levelJob_id": 6
                },
                {
                    "title": "Ruby on Rails Developer",
                    "description": "Vị trí: Ruby on Rails Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Ruby on Rails và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Ruby on Rails và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 23:15:34",
                    "expire_at": "2024-05-20 23:15:34",
                    "company_id": 11,
                    "location_name": "67 Hàng Vải, Phường Hàng Vải, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [25, 37],
                    "levelJob_id": 6
                },
                {
                    "title": "Express.js Developer",
                    "description": "Vị trí: Express.js Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Express.js và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Express.js và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "1500$",
                    "created_at": "2024-05-05 22:05:47",
                    "expire_at": "2024-05-21 22:05:47",
                    "company_id": 12,
                    "location_name": "81 Hàng Điếu, Phường Hàng Điếu, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [1, 2, 5],
                    "levelJob_id": 6
                },
                {
                    "title": "ASP.NET Developer",
                    "description": "Vị trí: ASP.NET Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng ASP.NET và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với ASP.NET và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "700$",
                    "created_at": "2024-05-05 20:55:23",
                    "expire_at": "2024-05-22 20:55:23",
                    "company_id": 13,
                    "location_name": "44 Hàng Gai, Phường Hàng Gai, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [27, 37, 30],
                    "levelJob_id": 2
                },
                {
                    "title": "Spring Boot Developer",
                    "description": "Vị trí: Spring Boot Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Spring Boot và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Spring Boot và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "1000$",
                    "created_at": "2024-05-05 19:45:36",
                    "expire_at": "2024-05-23 19:45:36",
                    "company_id": 14,
                    "location_name": "56 Hàng Bạc, Phường Hàng Bạc, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [4, 28, 37],
                    "levelJob_id": 5
                },
                {
                    "title": "Spring Boot Developer",
                    "description": "Vị trí: Spring Boot Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Spring Boot và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Spring Boot và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "1500$",
                    "created_at": "2024-05-05 19:45:36",
                    "expire_at": "2024-05-23 19:45:36",
                    "company_id": 11,
                    "location_name": "39 Hàng Đồng, Phường Hàng Đồng, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [4, 28, 37],
                    "levelJob_id": 5
                },
                {
                    "title": "Hibernate Developer",
                    "description": "Vị trí: Hibernate Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng Hibernate và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với Hibernate và các framework liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "3000$",
                    "created_at": "2024-05-05 18:35:49",
                    "expire_at": "2024-05-24 18:35:49",
                    "company_id": 15,
                    "location_name": "22 Hàng Mắm, Phường Hàng Mắm, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [29, 37, 39],
                    "levelJob_id": 6
                },
                {
                    "title": "SQL Server Developer",
                    "description": "Vị trí: SQL Server Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng SQL Server và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với SQL Server và các công nghệ liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "2000$",
                    "created_at": "2024-05-05 17:25:12",
                    "expire_at": "2024-05-25 17:25:12",
                    "company_id": 16,
                    "location_name": "70 Hàng Chiếu, Phường Hàng Chiếu, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [30, 31, 37],
                    "levelJob_id": 6
                },
                {
                    "title": "NodeJS Developer",
                    "description": "Vị trí: NodeJS Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng PostgreSQL và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với PostgreSQL và các công nghệ liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 16:15:25",
                    "expire_at": "2024-05-26 16:15:25",
                    "company_id": 17,
                    "location_name": "12 Hàng Đường, Phường Hàng Đường, Quận Hoàn Kiếm, Thành phố Hà Nội",
                    "typeJobs": [1, 2, 5],
                    "levelJob_id": 4
                },
                {
                    "title": "NodeJS Developer",
                    "description": "Vị trí: MongoDB Developer\n\nMô tả công việc:\n\n- Phát triển và duy trì các ứng dụng web sử dụng MongoDB và các công nghệ liên quan.\n- Yêu cầu kinh nghiệm: 3 năm.\n- Xây dựng các API và dịch vụ web để tích hợp với phía trước và phía sau của ứng dụng.\n- Tối ưu hóa hiệu suất của ứng dụng và hệ thống.\n- Phát triển các tính năng mới dựa trên yêu cầu của sản phẩm và khách hàng.\n- Tham gia vào việc phân tích và thiết kế hệ thống.\n- Tương tác chặt chẽ với các thành viên khác trong nhóm phát triển, bao gồm cả nhà thiết kế và nhà quản lý sản phẩm, để đảm bảo hiệu suất và chất lượng của ứng dụng.\n- Thực hiện kiểm tra và bảo trì để đảm bảo tính ổn định và tin cậy của hệ thống.\n\nYêu cầu công việc:\n\n- Có kinh nghiệm làm việc với MongoDB và các công nghệ liên quan.\n- Hiểu biết về các nguyên lý cơ bản của lập trình hướng sự kiện và lập trình bất đồng bộ.\n- Có kiến thức vững về các ngôn ngữ lập trình web như HTML, CSS, và JavaScript.\n- Thành thạo trong việc làm việc với cơ sở dữ liệu NoSQL và SQL.\n- Hiểu biết về các công cụ quản lý mã nguồn như Git.\n- Kỹ năng giao tiếp tốt và khả năng làm việc nhóm.\n- Khả năng tự học và nâng cấp kiến thức công nghệ liên tục.\n\nQuyền lợi công việc:\n\n- Mức lương cạnh tranh và các chế độ phúc lợi hấp dẫn.\n- Môi trường làm việc chuyên nghiệp và sáng tạo.\n- Cơ hội tham gia vào các dự án lớn và ứng dụng công nghệ tiên tiến.\n- Đào tạo và phát triển nghề nghiệp liên tục.",
                    "salary": "Thương lượng",
                    "created_at": "2024-05-05 15:05:38",
                    "expire_at": "2024-05-27 15:05:38",
                    "company_id": 18,
                    "location_name": "48 Chùa Bộc, Phường Quang Trung, Quận Đống Đa, Thành phố Hà Nội",
                    "typeJobs": [1, 2, 5],
                    "levelJob_id": 1
                }
            ]
            const existingJob = await this.jobRepository.findOne({ where: { title: jobData[0].title } })
            if (!existingJob) {
                for (let item of jobData) {
                    await this.jobService.create(item.company_id, item)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }


}