"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoScriptRandomly = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const grapevineer_grpc_pb_1 = require("grapevineer/gen/ts/v1/grapevineer_grpc_pb");
const bo_pb_1 = require("grapevineer/gen/ts/v1/bo_pb");
const grpcClient = new grapevineer_grpc_pb_1.GrapevineerClient('grapevineer-grpc.fly.dev:443', grpc.credentials.createInsecure());
const getBoScriptRandomly = async () => {
    const request = new bo_pb_1.GetBoScriptRandomlyRequest();
    return new Promise((resolve, reject) => {
        grpcClient.getBoScriptRandomly(request, (err, response) => {
            if (err || response === null) {
                console.error(err);
                reject(null);
            }
            resolve(response?.getScript());
        });
    });
};
exports.getBoScriptRandomly = getBoScriptRandomly;
