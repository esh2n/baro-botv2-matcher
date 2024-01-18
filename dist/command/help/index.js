"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCommand = void 0;
const command_1 = require("../command");
class HelpCommand extends command_1.CommandBase {
    static _instance = null;
    constructor() {
        super('help', 'help');
    }
    static getInstance() {
        if (!HelpCommand._instance) {
            HelpCommand._instance = new HelpCommand();
        }
        return HelpCommand._instance;
    }
    defineOptions() {
        return null;
    }
    async handle() {
        console.log('call help');
    }
}
exports.HelpCommand = HelpCommand;
exports.default = HelpCommand.getInstance();
