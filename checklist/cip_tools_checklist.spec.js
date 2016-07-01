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
    userNameField.sendKeys('sibu');
    userPassField.sendKeys('sibu');

    //Assertions for each field
    expect(userNameField.getAttribute('value')).toEqual('sibu');
    expect(userPassField.getAttribute('value')).toEqual('sibu');

    // Click to sign in - waiting for Angular as it is manually bootstrapped.
    userLoginBtn.click().then(function() {
      browser.waitForAngular();
      expect(browser.driver.getCurrentUrl()).toMatch('http://127.0.0.1:8282/#/app/dashboard');
    }, 10000);
  });

  //Audit Information Scenario
  it('Should Fill Audit Information', function() {
    //Browser redirecting to checklist Form (Note - Change the URL According to the localhost Configuration).
    browser.driver.get('http://127.0.0.1:8282/#/app/report/?type=cip_tools_checklist');
    var reporterName = browser.driver.findElement(By.name('title'));
    var reporterLocation = browser.driver.findElement(By.name('field_reporter_location'));

    //Sending Values to each field
    reporterName.sendKeys('Andrew');
    reporterLocation.sendKeys('California');

    //Selectors Dynamic
    element(by.xpath("//label[contains(.,'Business Unit')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
    browser.sleep(100);
    element(by.xpath("//div[@data-value='6956']")).click();
    // browser.sleep(100);
    element(by.xpath("//label[text()='Sector']/following-sibling::div[contains(@class,'form-item')]//input")).click();
    browser.sleep(100);
    element(by.xpath("//div[@data-value='7852']")).click();

    element(by.xpath("//label[contains(.,'Sub Sector')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
    browser.sleep(100);
    element(by.xpath("//div[@data-value='7853']")).click();

    element(by.xpath("//label[contains(.,'Department')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
    browser.sleep(100);
    element(by.xpath("//div[@data-value='7854']")).click();

    element(by.xpath("//label[contains(.,'Application Method')]/following-sibling::div[contains(@class,'form-item')]//select")).click();
    browser.sleep(100);
    element(by.cssContainingText('option', 'Milk farms')).click();
    browser.sleep(100);

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

      element(by.xpath("//label[contains(.,'Country')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(200);
      element(by.xpath("//div[@data-value='Afghanistan']")).click();

      element(by.xpath("//label[contains(.,'Currency')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(200);
      element(by.xpath("//div[@data-value='387']")).click();

      field_customer_number.sendKeys('DiverseyCare');
      field_customer_name.sendKeys('sibu');
      field_group_name.sendKeys('stephen');
      field_customer_contact.sendKeys('90909099');
      field_customer_role.sendKeys('developer');
      field_postal_code.sendKeys('123457');
      field_contact_phone_number.sendKeys('909030202');
      field_contact_email.sendKeys('Hey@e.com');
      field_location.sendKeys('Goa');

      //Assertions for Email Using Regex
      expect(field_contact_email.getAttribute('value')).toMatch(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/);
    });
  });


  it('Should Fill Measuring Units', function() {

    //Continue Button click on Customer Information
    var btn = element(by.css('.accordion-section:nth-child(2) .btn.btn-primary.ng-binding'));
    btn.click().then(function(){
      element(by.xpath("//label[contains('Currency In Report')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(100);
      element(by.xpath("//div[@data-value='387']")).click();

      var field_exchange_rate =browser.driver.findElement(By.name('field_exchange_rate' ));
      field_exchange_rate.sendKeys('12');

      element(by.xpath("//label[contains('Volume')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(100);
      element(by.xpath("//div[@data-value='2379']")).click();

      element(by.xpath("//label[contains('Volume In Report')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(100);
      element(by.xpath("//div[@data-value='5572']")).click();

      element(by.xpath("//label[contains('Weight')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(100);
      element(by.xpath("//div[@data-value='10']")).click();

      element(by.xpath("//label[contains('Temperature')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(100);
      element(by.xpath("//div[@data-value='12']")).click();


      element(by.xpath("//label[contains('Surface')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(100);
      element(by.xpath("//div[@data-value='15']")).click();

      element(by.xpath("//label[contains('Surface In Report')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(100);
      element(by.xpath("//div[@data-value='5569']")).click();

      element(by.xpath("//label[contains('Pressure')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(100);
      element(by.xpath("//div[@data-value='19']")).click();

      element(by.xpath("//label[contains('Concentration')]/following-sibling::div[contains(@class,'form-item')]//input")).click();
      browser.sleep(100);
      element(by.xpath("//div[@data-value='22']")).click();

      var add = element(by.xpath("//div[@class='accordion-section ng-isolate-scope'][3]"));
      add.click().then(function() {
        element(by.xpath("//div[@class='accordion-section ng-isolate-scope'][3]//div[@class='selectize-control ng-pristine ng-untouched ng-valid ng-isolate-scope single'][3]")).click();

      });
    });
  });


  it('Should Fill Cost Basis', function() {
    //Continue Button click on Customer Information
    var btn = element(by.css('.accordion-section:nth-child(3) .btn.btn-primary.ng-binding'));
    btn.click().then(function(){
      var field_slry_rate_cleaning_normal = browser.driver.findElement(By.name('field_slry_rate_cleaning_normal' ));
      var field_slry_rate_cleaning_night = browser.driver.findElement(By.name('field_slry_rate_cleaning_night'));
      var field_slry_rate_cleaning_overtim = browser.driver.findElement(By.name('field_slry_rate_cleaning_overtim'));
      var field_cost_of_incoming_water = browser.driver.findElement(By.name('field_cost_of_incoming_water'));
      var field_cost_of_waste_water = browser.driver.findElement(By.name('field_cost_of_waste_water'));
      var field_cost_of_steam =browser.driver.findElement(By.name('field_cost_of_steam'));
      var field_cost_of_electricity_per_kw = browser.driver.findElement(By.name('field_cost_of_electricity_per_kw'));
      var field_cost_of_air_per_volume = browser.driver.findElement(By.name('field_cost_of_air_per_volume'));
      var field_value_of_1_hr_prod_time = browser.driver.findElement(By.name('field_value_of_1_hr_prod_time'));
      var field_perc_sickness_leave_crew = browser.driver.findElement(By.name('field_perc_sickness_leave_crew'));


      field_slry_rate_cleaning_normal.sendKeys('12');
      field_slry_rate_cleaning_night.sendKeys('12');
      field_slry_rate_cleaning_overtim.sendKeys('14332');
      field_cost_of_incoming_water.sendKeys('121');
      field_cost_of_waste_water.sendKeys('123');
      field_cost_of_steam.sendKeys('123');
      field_cost_of_electricity_per_kw.sendKeys('12333');
      field_cost_of_air_per_volume.sendKeys('23');
      field_value_of_1_hr_prod_time.sendKeys('23');
      field_perc_sickness_leave_crew.sendKeys('34');
      /*Radio button xpath*/
      element(by.xpath("//label[contains(.,'Is Cleaning Time A Limiting Factor For Production')]/following-sibling::div//following-sibling::div[contains(@class,'radio')][3]")).click();

    });
  });
     /* Click the submit button*/
  it('should Click on Save function', function() {
    element(by.css(".pull-right.btn.btn-primary.button-space.ng-binding")).click().then(function(){
      browser.waitForAngular();
    }, 10000);
  });
});
