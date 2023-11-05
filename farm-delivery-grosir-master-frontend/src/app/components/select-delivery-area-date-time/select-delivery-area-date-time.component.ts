import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import * as moment from 'moment';

import { storeInSession, getFromSession } from '../../utils/session-storage';
import { DeliveryAreaDateTimeDataService } from '../../shared-services/delivery-area-date-time-data/delivery-area-date-time-data.service';

@Component({
  selector: 'app-select-delivery-area-date-time',
  templateUrl: './select-delivery-area-date-time.component.html',
  styleUrls: ['./select-delivery-area-date-time.component.scss'],
})
export class SelectDeliveryAreaDateTimeComponent implements OnInit, AfterViewInit, AfterViewChecked {

  cityData = [];
  selectedCity: string;
  selectedDate: any;
  selectedDeliveryTime: string;
  currentDateTime: any;
  orderPossibleDates = [];
  deliveryPossibleTimes = [];
  
  entireCityData = [];

  selectedDeliveryData: any = null;
  constructor(private modalController: ModalController,
              private navParams: NavParams,
              private deliveryAreaDateTimeService: DeliveryAreaDateTimeDataService) { 
              }
                            
  ngOnInit() {
    this.selectedDeliveryData = getFromSession('selectedDeliveryData');
    moment.locale('id');
    this.cityData = this.navParams.get('response').cities;
    let timestamp = this.navParams.get('response').timestamp;
    this.currentDateTime = moment(moment.unix(timestamp).format('YYYY-MM-DD hh:mmA'), 'YYYY-MM-DD hh:mmA');
    this.populateData();
    if(this.selectedDeliveryData == null){
      this.selectDefaultDeliveryCity(this.cityData[0].city);
      this.selectDefaultDeliveryDate();
      this.selectDefaultDeliveryTime();
      this.sendDeliveryDataToService();
    }
    else{
      this.selectedCity = this.selectedDeliveryData.city;
      this.orderPossibleDates = this.getOrderPossibleDates();

      this.selectedDate = this.selectedDeliveryData.deliveryDate;
      this.deliveryPossibleTimes = this.getDeliveryPossibleTimes();

      this.selectedDeliveryTime = this.selectedDeliveryData.deliveryTime;
    }

    this.storeSelectedDeliveryAreaDateInSessionStorage();
  }

  ngAfterViewInit(){
    let selectedDateId = this.getDeliveryDateObject(this.selectedDate).id;
    this.changeButtonColor(selectedDateId, 'rgb(239,124,27)', 'white', 'white', 'white');
  }

  ngAfterViewChecked(){
    let selectedDateId = this.getDeliveryDateObject(this.selectedDate).id;
    this.changeButtonColor(selectedDateId, 'rgb(239,124,27)', 'white', 'white', 'white');
  }

  selectDefaultDeliveryCity(selectedCity){
    this.selectedCity = selectedCity;
    this.orderPossibleDates = this.getOrderPossibleDates();
  }

  selectDefaultDeliveryDate(){
    for(let data of this.entireCityData){
      if(data.city === this.selectedCity)
      {
        for(let date of data.deliveryDates)
        {
          if(date.isDefaultDate){
            this.selectedDate = date.formattedDate;
            this.deliveryPossibleTimes = this.getDeliveryPossibleTimes();
            return;
          }
        }
      }
    }
  }

  selectDefaultDeliveryTime(){
    for(let data of this.entireCityData){
      if(data.city === this.selectedCity)
      {
        for(let date of data.deliveryDates)
        {
          if(date.formattedDate === this.selectedDate){
            for(let time of date.deliveryTimes){
              if(time.isDefaultTime)
              {
                this.selectedDeliveryTime = time.time;
                return;
              }
            }
          }
        }
      }
    }
  }

  getOrderPossibleDates(){
    for(let data of this.entireCityData){
      if(data.city === this.selectedCity)
      {
        return data.deliveryDates;
      }
    }
  }

  getDeliveryPossibleTimes(){
    for(let data of this.entireCityData){
      if(data.city === this.selectedCity)
      {
        for(let date of data.deliveryDates)
        {
          if(date.formattedDate === this.selectedDate){
            return date.deliveryTimes;
          }
        }
      }
    }
  }

  populateData(){
    for(let data of this.cityData){
      this.getDeliveryDatesTimes(data);
    }
  }

  getDeliveryDatesTimes(data){
      let orderAcceptBeforeNHours = data.order_accept_before_n_hours; 
      let sameDayDelivery = data.same_day_delivery;
      let deliveryTimings = data.delivery_timings;
      let nextNDaysAcceptOrders = data.next_n_days_accept_orders;
      let i = 0;
      let tempDates = [];
      if(!sameDayDelivery){
        i=1;
      } 

      for(; i < nextNDaysAcceptOrders + 1; i++)
      {
        let disableDeliveryDate = false;
        let isDefaultDate = false;  
        let newDate = this.currentDateTime.clone().add(i, 'days');
        let deliveryTimes = this.getDeliveryTimes(orderAcceptBeforeNHours, deliveryTimings, newDate);
        if(deliveryTimes.length == 0){
          disableDeliveryDate = true;
        }
        if(i === 1){
          isDefaultDate = true;
        }
        let localeDate = newDate.clone().format('LLLL').toString().split(' ');
        let dateData = {
                      "id": i,
                      "day": localeDate[0].split(',')[0],
                      "localeDate": localeDate[1]+' '+localeDate[2].toString().split(',')[0],
                      "isDisabled": disableDeliveryDate,
                      "formattedDate": newDate.format('YYYY-MM-DD'),
                      "isDefaultDate": isDefaultDate,
                      "deliveryTimes": deliveryTimes
                    }
        tempDates.push(dateData);
      }
      data['deliveryDates'] = tempDates;
      this.entireCityData.push(data);
  }

  getDeliveryTimes(orderAcceptBeforeNHours, deliveryTimings, date){
    deliveryTimings = deliveryTimings.split(', ');
    let dateString = date.format('YYYY-MM-DD');
    let tempDeliveryTimes = [];
    let i = 0;
    for(let deliveryTime of deliveryTimings){
      let isDefaultTime = false;
      let deliveryStartTime = deliveryTime.split('to')[0];
      let deliveryStartDateTime = moment(dateString+' '+deliveryStartTime, 'YYYY-MM-DD hh:mmA');
      deliveryStartDateTime.subtract(orderAcceptBeforeNHours, 'hours');
      if(this.currentDateTime.isBefore(deliveryStartDateTime)){
        if(i==0)
        {
          isDefaultTime = true;
        }
        let timeData = {
            "id": i,
            "time": deliveryTime,
            "isDefaultTime": isDefaultTime
        }
        tempDeliveryTimes.push(timeData);
        i++;
      }
    }
    return tempDeliveryTimes;
  }

  cityChanged(citySelected){
    this.selectedCity = citySelected;
    this.orderPossibleDates = this.getOrderPossibleDates();
    this.selectDefaultDeliveryDate();
    this.selectDefaultDeliveryTime();
  }

  getDeliveryDateObject(date){
    for(let data of this.entireCityData){
      if(data.city === this.selectedCity)
      {
        for(let deliveryDate of data.deliveryDates)
        {
          if(deliveryDate.formattedDate === date){
            return deliveryDate;
          }
        }
      }
    }
  }
  
  changeButtonColor(elementId, buttonBackgroundColor, dateIconColor,
                    cardTitleColor, cardsubtitleColor){
    document.getElementById('button'+elementId).style.backgroundColor = buttonBackgroundColor;
    document.getElementById('dateicon'+elementId).setAttribute('color', dateIconColor);
    document.getElementById('cardtitle'+elementId).style.color = cardTitleColor;
    document.getElementById('cardsubtitle'+elementId).style.color = cardsubtitleColor;
  }

  deliveryDateChanged(dateSelected, elementId){
    let prevSelectedDate = this.selectedDate;
    let prevSelectedDateId = this.getDeliveryDateObject(this.selectedDate).id;
    this.selectedDate = dateSelected;
    this.changeButtonColor(elementId, 'rgb(239,124,27)', 'white', 'white', 'white');
    if(prevSelectedDate != dateSelected){
      this.changeButtonColor(prevSelectedDateId, 'rgb(230, 230, 230)', 'black', 'black', 'black');
    }
    this.deliveryPossibleTimes = this.getDeliveryPossibleTimes();
    this.selectDefaultDeliveryTime();
  }

  deliveryTimeChanged(deliveryTimeSelected){
    this.selectedDeliveryTime = deliveryTimeSelected;
  }

  closeModal(){
    this.modalController.dismiss();
  }

  submit(){
    this.storeSelectedDeliveryAreaDateInSessionStorage();
    this.sendDeliveryDataToService();
    this.modalController.dismiss();
  }

  getCityObj(selectedCity){
    for(let cityObj of this.cityData){
      if(cityObj.city === selectedCity){
        return cityObj;
      }
    }
    return null;
  }

  storeSelectedDeliveryAreaDateInSessionStorage(){
    let date = this.getDeliveryDateObject(this.selectedDate);
    let dataConstructed = date.day + ' - ' + date.localeDate + ', ' + this.selectedDeliveryTime;
    let selectedDeliveryData = {
      "city": this.selectedCity,
      "deliveryDate": this.selectedDate,
      "deliveryTime": this.selectedDeliveryTime,
      "dataConstructed": dataConstructed,
      "cityObj": this.getCityObj(this.selectedCity)
    };
    storeInSession('selectedDeliveryData', selectedDeliveryData);
  }

  sendDeliveryDataToService()
  {
    let date = this.getDeliveryDateObject(this.selectedDate);
    let dataConstructed = date.day + ' - ' + date.localeDate + ', ' + this.selectedDeliveryTime;
    let selectedDeliveryData = {
      "city": this.selectedCity,
      "deliveryDate": this.selectedDate,
      "deliveryTime": this.selectedDeliveryTime,
      "dataConstructed": dataConstructed
    };
    this.deliveryAreaDateTimeService.changeMessage(selectedDeliveryData);
  }
}
