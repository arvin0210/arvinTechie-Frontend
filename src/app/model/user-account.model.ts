export interface UserAccount {
    id: number;
    firstName: string;
    lastName: string;
    status: boolean;
    email: string;
    reportingTo: number;
    createdDate: Date;
    lastEditedDate: Date;
}


// UserAccountDto(id=2, firstName=Arvin, lastName=Pillaai, status=true, email=arvin.0210@gmail.com, createdDate=2022-04-07 13:26:04.569, reportingTo=1, lastEditedDate=2022-04-07 13:26:04.569, 
// role=RoleDetail(id=4, roleName=FullStack Developer, isAdmin=false))

export interface UserAccountDto {
    id: number;
    firstName: string;
    lastName: string;
    status: boolean;
    email: string;
    reportingTo: number;
    createdDate: Date;
    lastEditedDate: Date;
    role: RoleDetail;
}

export interface RoleDetail {
    id: number;
    roleName: string;
    admin: boolean;
}

// TeamMate(id=5, roleName=Frontend Developer, firstName=Sharon, lastName=Tay, email=sharon.tay@gmail.com, currentUser=true)
export interface TeamMate {
    id: number;
    roleName: string;
    firstName: string;
    lastName: string;
    email: string;
    currentUser: boolean;
}

export interface DtoMember {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: boolean;
    roleId: number;
    userLoginUserName: string;
}