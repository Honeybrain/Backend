// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var logs_pb = require('./logs_pb.js');

function serialize_LogResponse(arg) {
  if (!(arg instanceof logs_pb.LogResponse)) {
    throw new Error('Expected argument of type LogResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_LogResponse(buffer_arg) {
  return logs_pb.LogResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_StreamLogsRequest(arg) {
  if (!(arg instanceof logs_pb.StreamLogsRequest)) {
    throw new Error('Expected argument of type StreamLogsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_StreamLogsRequest(buffer_arg) {
  return logs_pb.StreamLogsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var LogServiceService = exports.LogServiceService = {
  streamLogs: {
    path: '/LogService/StreamLogs',
    requestStream: false,
    responseStream: true,
    requestType: logs_pb.StreamLogsRequest,
    responseType: logs_pb.LogResponse,
    requestSerialize: serialize_StreamLogsRequest,
    requestDeserialize: deserialize_StreamLogsRequest,
    responseSerialize: serialize_LogResponse,
    responseDeserialize: deserialize_LogResponse,
  },
};

exports.LogServiceClient = grpc.makeGenericClientConstructor(LogServiceService);
