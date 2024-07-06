import { UserError } from "./base";

import config from "config";

export class NoPermissions extends UserError {
    constructor() {
        super("Bạn không có quyền dùng lệnh này!");
    }
}

export class BotHasNoPermissions extends UserError {
    constructor() {
        super(" Mình không có quyền để tiến hành sử dụng lệnh này!");
    }
}

export class TargetIsSelf extends UserError {
    constructor() {
        super(" Mình không thể sử dụng lệnh lên bản thân!");
    }
}

export class TargetIsAuthor extends UserError {
    constructor() {
        super(" Bạn không thể sử dụng lệnh lên bản thân!");
    }
}

export class TargetNotFound extends UserError {
    constructor() {
        super("Mình Không tìm thấy mục tiêu");
    }
}

export class AuthorRoleIsLower extends UserError {
    constructor() {
        super(" Bạn không thể sử dụng lệnh này vì họ có quyền cao hơn hoặc bằng bạn!");
    }
}

export class BotRoleIsLower extends UserError {
    constructor() {
        super(" Mình không thể sử dụng lệnh này vì họ có quyền cao hơn hoặc bằng mình!");
    }
}