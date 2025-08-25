import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContractDto, CreateBindingDto } from './dto/create-contract.dto';
import { Urn } from 'src/schemas/urn.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v5 as uuidv5, validate as uuidValidate } from 'uuid';
import * as moment from 'moment';
import { Contract } from 'src/schemas/contract.schema';
import { Binding } from 'src/schemas/binding.schema';
import { Region } from 'src/schemas/region.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Urn.name)
    private urnModel: Model<Urn>,
    @InjectModel(Contract.name)
    private contractModel: Model<Contract>,
    @InjectModel(Binding.name)
    private bindingModel: Model<Binding>,
    @InjectModel(Region.name)
    private regionModel: Model<Region>
  ) {}
  private readonly ifricId = process.env.IFRIC_NAMESPACE;
  private readonly contractCode = process.env.CONTRACT_DEFAULT_CODE;
  private readonly bindingCode = process.env.BINDING_DEFAULT_CODE;

  async createBinding(data: CreateBindingDto) {
    try {
      let uuid = uuidv5(data.company_ifric_id + new Date().toISOString(), this.ifricId);
      let bindingCodeArr = this.bindingCode.split('-');
      let region_code = data.company_ifric_id.split("-")[1].toUpperCase();
      const regionData = await this.regionModel.find();
      regionData.forEach(value => {
        if(value.region_code.startsWith(region_code)) {
          region_code = value.region_code;
        }
      })
      let ifricId = `urn:ifric:${bindingCodeArr[0].toLowerCase()}-${region_code.toLowerCase()}-${bindingCodeArr[1].toLowerCase()}-${bindingCodeArr[2].toLowerCase()}-${uuid}`;
      const urnData = new this.urnModel({
        urn: ifricId,
        created_at: moment().format(),
        last_updated_at: moment().format()
      })
      const savedUrnData = await urnData.save();

      const bindingData = new this.bindingModel({
        urn_id: savedUrnData._id,
        binding_datetime_string: data.binding_datetime_string,
        company_ifric_id: data.company_ifric_id,
        created_at: moment().format(),
        last_updated_at: moment().format() 
      })
      await bindingData.save();
      return { status: 201, message: 'Binding created successfully', urn_id: ifricId };
    } catch(err) {
      if (err instanceof HttpException) {
        throw err;
      } else if(err.response) {
        throw new HttpException(err.response.data.message, err.response.status);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async createContract(data: CreateContractDto) {
    try {
      let uuid = uuidv5(data.company_ifric_id + new Date().toISOString(), this.ifricId);
      let contractCodeArr = this.contractCode.split('-');
      let region_code = data.company_ifric_id.split("-")[1].toUpperCase();
      const regionData = await this.regionModel.find();
      regionData.forEach(value => {
        if(value.region_code.startsWith(region_code)) {
          region_code = value.region_code;
        }
      })
      let ifricId = `urn:ifric:${contractCodeArr[0].toLowerCase()}-${region_code.toLowerCase()}-${contractCodeArr[1].toLowerCase()}-${contractCodeArr[2].toLowerCase()}-${uuid}`;
      const urnData = new this.urnModel({
        urn: ifricId,
        created_at: moment().format(),
        last_updated_at: moment().format()
      })
      const savedUrnData = await urnData.save();
      const contractData = new this.contractModel({
        urn_id: savedUrnData._id,
        contract_datetime_string: data.contract_datetime_string,
        company_ifric_id: data.company_ifric_id,
        created_at: moment().format(),
        last_updated_at: moment().format() 
      })
      await contractData.save();
      return { status: 201, message: 'Contract created successfully', urn_id: ifricId };
    } catch(err) {
      if (err instanceof HttpException) {
        throw err;
      } else if(err.response) {
        throw new HttpException(err.response.data.message, err.response.status);
      } else {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
