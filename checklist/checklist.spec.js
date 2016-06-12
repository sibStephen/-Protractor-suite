describe('BEST Application', function() {
  browser.driver.get('http://127.0.0.1:8282/#/login');
  //Should Login Scenario
  it('should render login page', function() {

      // Checking the current url
      var currentUrl = browser.driver.getCurrentUrl();
  });

  // Should Sign In Scenario
  it('should sign in', function() {

    //Mapping each field with the browser specfic element
    var userNameField = browser.driver.findElement(By.name('user'));
    var userPassField = browser.driver.findElement(By.name('password'));
    var userLoginBtn  = browser.driver.findElement(By.className('btn-login'));

    //Sending Values to each field
    userNameField.sendKeys('vrindha');
    userPassField.sendKeys('best');

    //Assertions for each field
    expect(userNameField.getAttribute('value')).toEqual('vrindha');
    expect(userPassField.getAttribute('value')).toEqual('best');

    // Click to sign in - waiting for Angular as it is manually bootstrapped.
    userLoginBtn.click().then(function() {
        browser.waitForAngular();
        expect(browser.driver.getCurrentUrl()).toMatch('http://127.0.0.1:8282/#/app/dashboard');
    }, 10000);
  });

  //Audit Information Scenario
  it('Should Fill Audit Information', function() {
    //Browser redirecting to checklist Form (Note - Change the URL According to the localhost Configuration).
    browser.driver.get('http://127.0.0.1:8282/#/app/report/?type=checklist');
    var reporterName = browser.driver.findElement(By.name('title'));
    var reporterLocation = browser.driver.findElement(By.name('field_reporter_location'));

    //Sending Values to each field
    reporterName.sendKeys('Andrew');
    reporterLocation.sendKeys('California');

    var add = element(by.xpath("//div[@class='accordion-section ng-isolate-scope'][1]"));
      add.click().then(function() {
      element(by.xpath("//div[@class='accordion-section ng-isolate-scope'][1]//div[@class='selectize-control ng-pristine ng-untouched ng-valid ng-isolate-scope single'][1]")).click();
      });
  });

  //Customer Information Scenario
  it('Should Fill Customer Information', function() {
    //Continue Button click on Customer Information
    var btn = element(by.css('.accordion-section:nth-child(1) .btn.btn-primary.ng-binding'));
    btn.click().then(function(){
      var field_customer_number = browser.driver.findElement(By.name('field_customer_number' ));
      var field_customer_name = browser.driver.findElement(By.name('field_customer_name'));
      var field_group_name = browser.driver.findElement(By.name('field_group_name'));
      var field_customer_contact = browser.driver.findElement(By.name('field_customer_contact'));
      var field_customer_role = browser.driver.findElement(By.name('field_customer_role'));
      var field_postal_code = browser.driver.findElement(By.name('field_postal_code'));
      var field_contact_phone_number = browser.driver.findElement(By.name('field_contact_phone_number'));
      var field_contact_email = browser.driver.findElement(By.name('field_contact_email'));
      var field_location = browser.driver.findElement(By.name('field_location'));

      // var country = element(by.xpath("//div[@class='.accordion-section:nth-child(1)']//div[@class='selectize-control ng-pristine ng-untouched ng-valid ng-isolate-scope single']"));
      //  add.click();
      //  element(by.xpath("//div[@data-value='7411']"));

      //  var add = element(by.xpath("//div[@class='.accordion-section:nth-child(1)']//div[@class='selectize-control ng-pristine ng-untouched ng-valid ng-isolate-scope single']"));
      //    add.click();
         // element(by.xpath("//div[@data-value='7411']"));


      field_customer_number.sendKeys('DiverseyCare');
      field_customer_name.sendKeys('Hey');
      field_group_name.sendKeys('Hey');
      field_customer_contact.sendKeys('Hey');
      field_customer_role.sendKeys('Hey');
      field_postal_code.sendKeys('Hey');
      field_contact_phone_number.sendKeys('Hey');
      field_contact_email.sendKeys('Hey@e.com');
      field_location.sendKeys('Hey');

      //Assertions for Email Using Regex
      expect(field_contact_email.getAttribute('value')).toMatch(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/);
    });
  });

  //Production Information Scenario
  it('Should Fill Production Information', function() {
  element.all(by.css(".accordion-section:nth-child(2) .btn.btn-primary.ng-binding")).click().then(function(){

    var field_total_water_in_product = browser.driver.findElement(By.name('field_total_water_in_product'));
    field_total_water_in_product.sendKeys(1233);
    expect(field_total_water_in_product.getAttribute('value')).toMatch(/^\d+$/);

    var field_operating_days_per_week = browser.driver.findElement(By.name('field_operating_days_per_week'));
    field_operating_days_per_week.sendKeys(2);
    expect(field_operating_days_per_week.getAttribute('value')).toMatch(/^[0-7]$/);

    var field_operating_hours_per_day = browser.driver.findElement(By.name('field_operating_hours_per_day'));
    field_operating_hours_per_day.sendKeys(12);
    expect(field_operating_hours_per_day .getAttribute('value')).toMatch(/^([1-9]|[1][0-9]|[2][0-4])$/);

    var field_operating_weeks_per_year = browser.driver.findElement(By.name('field_operating_weeks_per_year'));
    field_operating_weeks_per_year.sendKeys(1);

    //Assertions for Fields Using Regex
    expect(field_operating_weeks_per_year.getAttribute('value')).toMatch(/^([1-9]|[1-4][0-9]|[5][0-2])$/);
  });
  });

  //Water Supply Scenario
  it('Should Fill Water Supply', function() {
  element(by.css(".accordion-section:nth-child(3) .btn.btn-primary.ng-binding")).click().then(function(){

    var field_water_supply_source_name = browser.driver.findElement(By.name('field_water_supply_source_name'));
    field_water_supply_source_name.sendKeys(1212);
    expect(field_water_supply_source_name.getAttribute('value')).toMatch(/^\d+$/);

    var ws_field_incoming_cost_per_unit = browser.driver.findElement(By.name('ws_field_incoming_cost_per_unit'));
    ws_field_incoming_cost_per_unit.sendKeys(211);
    expect(ws_field_incoming_cost_per_unit.getAttribute('value')).toMatch(/^[0-9]+(\.[0-9]{1,2})?$/);

    var ws_field_outgoing_cost_per_unit = browser.driver.findElement(By.name('ws_field_outgoing_cost_per_unit'));
    ws_field_outgoing_cost_per_unit.sendKeys(1222);
    expect(ws_field_outgoing_cost_per_unit.getAttribute('value')).toMatch(/^[0-9]+(\.[0-9]{1,2})?$/);

    var field_total_incoming_water_volum = browser.driver.findElement(By.name('field_total_incoming_water_volum'));
    field_total_incoming_water_volum.sendKeys(123);
    expect(field_total_incoming_water_volum.getAttribute('value')).toMatch(/^[0-9]+(\.[0-9]{1,2})?$/);

    var field_total_outgoing_water_volum = browser.driver.findElement(By.name('field_total_outgoing_water_volum'));
    field_total_outgoing_water_volum.sendKeys(12345);
    expect(field_total_outgoing_water_volum.getAttribute('value')).toMatch(/^[0-9]+(\.[0-9]{1,2})?$/);
  });
  });

  //Value Stream Scenario
  it('Should Fill Value Stream', function() {
  element(by.css(".accordion-section:nth-child(4) .btn.btn-primary.ng-binding")).click().then(function(){

    var field_stream_name = browser.driver.findElement(By.name('field_stream_name'));
    field_stream_name.sendKeys(1234);
    expect(field_stream_name.getAttribute('value')).toMatch(/^\d+$/);

    var vs_field_incoming_cost_per_unit = browser.driver.findElement(By.name('vs_field_incoming_cost_per_unit'));
    vs_field_incoming_cost_per_unit.sendKeys(12324);
    expect(vs_field_incoming_cost_per_unit.getAttribute('value')).toMatch(/^[0-9]+(\.[0-9]{1,2})?$/);

    var vs_field_outgoing_cost_per_unit = browser.driver.findElement(By.name('vs_field_outgoing_cost_per_unit'));
    vs_field_outgoing_cost_per_unit.sendKeys(22344);
    expect(vs_field_outgoing_cost_per_unit.getAttribute('value')).toMatch(/^[0-9]+(\.[0-9]{1,2})?$/);
  });
  });

  /*Click of Submit button*/
  it('should Click on Save function', function() {
  element(by.css(".pull-right.btn.btn-primary.ng-binding")).click().then(function(){
    browser.waitForAngular();
  }, 10000);
  });
});
