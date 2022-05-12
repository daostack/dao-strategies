// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class CampaignCreated extends ethereum.Event {
  get params(): CampaignCreated__Params {
    return new CampaignCreated__Params(this);
  }
}

export class CampaignCreated__Params {
  _event: CampaignCreated;

  constructor(event: CampaignCreated) {
    this._event = event;
  }

  get creator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newCampaign(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _sharesRoot(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }

  get _sharesTotal(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get _uri(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }

  get _guardian(): Address {
    return this._event.parameters[5].value.toAddress();
  }

  get _oracle(): Address {
    return this._event.parameters[6].value.toAddress();
  }

  get _sharesPublished(): boolean {
    return this._event.parameters[7].value.toBoolean();
  }

  get _claimPeriodStart(): BigInt {
    return this._event.parameters[8].value.toBigInt();
  }

  get salt(): Bytes {
    return this._event.parameters[9].value.toBytes();
  }
}

export class CampaignFactory extends ethereum.SmartContract {
  static bind(address: Address): CampaignFactory {
    return new CampaignFactory("CampaignFactory", address);
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _master(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateCampaignCall extends ethereum.Call {
  get inputs(): CreateCampaignCall__Inputs {
    return new CreateCampaignCall__Inputs(this);
  }

  get outputs(): CreateCampaignCall__Outputs {
    return new CreateCampaignCall__Outputs(this);
  }
}

export class CreateCampaignCall__Inputs {
  _call: CreateCampaignCall;

  constructor(call: CreateCampaignCall) {
    this._call = call;
  }

  get _shares(): CreateCampaignCall_sharesStruct {
    return changetype<CreateCampaignCall_sharesStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }

  get _uri(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get _guardian(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _oracle(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _sharesPublished(): boolean {
    return this._call.inputValues[4].value.toBoolean();
  }

  get _claimPeriodStart(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get salt(): Bytes {
    return this._call.inputValues[6].value.toBytes();
  }
}

export class CreateCampaignCall__Outputs {
  _call: CreateCampaignCall;

  constructor(call: CreateCampaignCall) {
    this._call = call;
  }
}

export class CreateCampaignCall_sharesStruct extends ethereum.Tuple {
  get totalShares(): BigInt {
    return this[0].toBigInt();
  }

  get sharesMerkleRoot(): Bytes {
    return this[1].toBytes();
  }
}