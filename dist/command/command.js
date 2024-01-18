"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBase = void 0;
class CommandBase {
    command;
    constructor(commandName, commandDescription) {
        const options = this.defineOptions();
        if (options == null) {
            this.command = {
                name: commandName,
                description: commandDescription,
            };
        }
        else {
            this.command = {
                name: commandName,
                description: commandDescription,
                options: options,
            };
        }
    }
    getCommand() {
        return this.command;
    }
}
exports.CommandBase = CommandBase;
