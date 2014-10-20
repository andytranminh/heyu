/**
 * Created by tientm2 on 10/18/2014.
 */
function formatCurrency(value) {
    var result = value;

    if (typeof value === "function") {
        result = value();
    }
    if(typeof result === "string"){
        if(result.indexOf('.')>0) {
            result = result.substring(0, result.indexOf('.'));
        }
        result = result.replace(/[^0-9]+/g, "");
    }
    return '$' + " " + GetFloat(result).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}
function GetInt(val){
    if(val === '' || val === undefined){
        return 0;
    } else {
        if(typeof val === "string"){
            val = val.replace(/[^0-9]+/g, "");
        }
        return parseInt(val);
    }
}
function GetFloat(val){
    if(val === '' || val === undefined){
        return 0;
    } else {
        if(typeof val === "string"){
            val = val.replace(/[^0-9]+/g, "");
        }
        return parseFloat(val);
    }
}
try {
    (function () {
        //thisModel;
        thisModel = {
            PassiveIncome: ko.observable(''),
            PayCheck: ko.observable(''),
            MoneyInHand: ko.observable(''),
            Salary: ko.observable(''),
            Income: ko.observableArray([]),
            StockAsset: ko.observableArray([]),
            BusinessAsset: ko.observableArray([]),
            NumberOfChild: ko.observable(''),
            CostPerChild: ko.observable(''),
            Expenses: {
                Tax: ko.observable(0),
                HomeMortgage: ko.observable(0),
                SchoolLoan: ko.observable(0),
                CarLoan: ko.observable(0),
                CreditCard: ko.observable(0),
                Retail: ko.observable(0),
                Other: ko.observable(0),
                Child: ko.observable(0),
                Loan: ko.observable(0)
            },
            Liabilities: {
                HomeMortgage: ko.observable(0),
                SchoolLoan: ko.observable(0),
                CarLoan: ko.observable(0),
                CreditCard: ko.observable(0),
                Retail: ko.observable(0),
                Bank: ko.observable(0),
                BankPercent: ko.observable(0)
            },
            TotalIncome: ko.observable(''),
            TotalLoans: ko.observable(''),
            TotalExps: ko.observable(''),
            GetTotalIncome: function () {
                var result = 0;
                for (var i = 0; i < thisModel.Income().length; i++) {
                    result += GetInt(thisModel.Income()[i].Cost);
                }
                thisModel.UpdatePayCheck();
                return result + GetInt(thisModel.Salary());
            },
            GetTotalExp: function () {
                var result = 0;
                for (var i = 0; i < thisModel.Loans().length; i++) {
                    if (GetInt(thisModel.Loans()[i]().Expenses) > 0) {
                        result += GetInt(thisModel.Loans()[i]().Expenses);
                    }
                }
                thisModel.UpdatePayCheck();
                thisModel.TotalExps(result);
            },
            GetTotalLoan: function () {
                var result = 0;
                for (var i = 0; i < thisModel.Loans().length; i++) {
                    if (i === 8) {
                        if (GetInt(thisModel.Loans()[i]().Liabilities) > 0) {
                            thisModel.UpdateBankLoan();
                        }
                    }
                    if (GetInt(thisModel.Loans()[i]().Liabilities) > 0) {
                        result += GetInt(thisModel.Loans()[i]().Liabilities);
                    }
                }
                thisModel.UpdatePayCheck();
                thisModel.TotalLoans(result);
            },
            Loans: ko.observableArray([]),
            AddChild: function () {
                thisModel.NumberOfChild(thisModel.NumberOfChild() + 1);
                if (thisModel.NumberOfChild() > 3) {
                    thisModel.NumberOfChild(3)
                }
                var Child = thisModel.Loans()[7]();
                Child.Expenses = thisModel.NumberOfChild() * thisModel.CostPerChild();
                thisModel.Loans()[7](thisModel.Loans()[7]());
                thisModel.UpdatePayCheck();
            },
            RemoveChild: function () {
                thisModel.NumberOfChild(thisModel.NumberOfChild() - 1);
                if (thisModel.NumberOfChild() < 0) {
                    thisModel.NumberOfChild(0)
                }
                var Child = thisModel.Loans()[7]();
                Child.Expenses = thisModel.NumberOfChild() * thisModel.CostPerChild();
                thisModel.Loans()[7](thisModel.Loans()[7]());
                thisModel.UpdatePayCheck();
            },
            AddIncome: function () {
                thisModel.Income().push({
                    Index: thisModel.StockAsset().length,
                    Description: "",
                    Cost: ""
                });
                thisModel.Income(thisModel.Income());
                thisModel.UpdatePassiveIncome();
                thisModel.UpdatePayCheck();
            },
            RemoveIncome: function (data) {
                thisModel.Income().splice(thisModel.Income().indexOf(data), 1);
                thisModel.Income(thisModel.Income());
                thisModel.UpdatePassiveIncome();
                thisModel.UpdatePayCheck();
            },
            UpdatePayCheck: function () {
                var passive = GetInt(thisModel.PassiveIncome());
                var salary = GetInt(thisModel.Salary());
                var expense = 0;
                for (var i = 0; i < thisModel.Loans().length; i++) {
                    if (thisModel.Loans()[i]().Expenses > 0) {
                        expense += GetInt(thisModel.Loans()[i]().Expenses);
                    }
                }
                if (expense < 0) {
                    expense = 0;
                }
                thisModel.Charity(salary * 0.01);
                thisModel.PayCheck((passive + salary) - expense);
            },
            UpdateBankLoan: function () {
                thisModel.Loans()[8]().Expenses = GetFloat(thisModel.Loans()[8]().Liabilities) * GetFloat(thisModel.Loans()[9]().Liabilities);
                thisModel.Loans()[8](thisModel.Loans()[8]());
                thisModel.GetTotalExp();
            },
            UpdatePassiveIncome: function () {
                thisModel.PassiveIncome('');
                for (var i = 0; i < thisModel.Income().length; i++) {
                    thisModel.PassiveIncome(thisModel.PassiveIncome() + GetInt(thisModel.Income()[i].Cost));
                }
                thisModel.UpdatePayCheck();
            },
            AddStockAsset: function () {
                thisModel.IsAddStock(true);
            },
            IsAddStock: ko.observable(false),
            NewStock: {
                Name: ko.observable(''),
                Quantity: ko.observable(''),
                Cost: ko.observable('')
            },
            AddNewStock: function () {
                thisModel.StockAsset().push({
                    Index: thisModel.StockAsset().length,
                    Name: thisModel.NewStock.Name(),
                    Quantity: thisModel.NewStock.Quantity(),
                    Cost: thisModel.NewStock.Cost()
                });
                thisModel.ActionOutcome(GetInt(thisModel.NewStock.Quantity()) * GetInt(thisModel.NewStock.Cost()));
                thisModel.FOutcome();
                thisModel.NewStock.Name('');
                thisModel.NewStock.Quantity('');
                thisModel.NewStock.Cost('');
                thisModel.StockAsset(thisModel.StockAsset());
                thisModel.IsAddStock(false);
            },
            RemoveStockAsset: function (data) {
                thisModel.OpenSellStock(data);
                thisModel.SelectedStock = data;
            },
            IsAddBusiness: ko.observable(false),
            NewBusiness: {
                Name: ko.observable(''),
                DownPayment: ko.observable(''),
                Cost: ko.observable('')
            },
            AddBusinessAsset: function () {
                thisModel.IsAddBusiness(true);
            },
            AddNewBusiness: function () {
                thisModel.BusinessAsset().push({
                    Index: thisModel.BusinessAsset().length,
                    Name: thisModel.NewBusiness.Name(),
                    DownPayment: thisModel.NewBusiness.DownPayment(),
                    Cost: thisModel.NewBusiness.Cost()
                });
                thisModel.ActionOutcome(GetInt(thisModel.NewBusiness.DownPayment()) > 0 ? GetInt(thisModel.NewBusiness.DownPayment()) : GetInt(thisModel.NewBusiness.Cost()));
                thisModel.FOutcome();
                thisModel.NewBusiness.Name('');
                thisModel.NewBusiness.DownPayment('');
                thisModel.NewBusiness.Cost('');
                thisModel.BusinessAsset(thisModel.BusinessAsset());
                thisModel.IsAddBusiness(false);
            },
            RemoveBusinessAsset: function (data) {
                thisModel.OpenSellBusiness(data);
                thisModel.SelectedNBusiness = data;
            },
            SaleStock: {
                Name: ko.observable(''),
                Quantity: ko.observable(''),
                Cost: ko.observable(''),
                SellCost: ko.observable(''),
                Total: ko.observable('')
            },
            SelectedStock: {},
            SelectedNBusiness: {},
            SaleBusiness: {
                Name: ko.observable(''),
                DownPayment: ko.observable(''),
                Cost: ko.observable(''),
                SellCost: ko.observable(''),
                Total: ko.observable('')
            },
            IsSaleStock: ko.observable(false),
            IsSaleBusiness: ko.observable(false),
            OpenSellStock: function (data, callback) {
                thisModel.SaleStock.Name(data.Name);
                thisModel.SaleStock.Quantity(data.Quantity);
                thisModel.SaleStock.Cost(data.Cost);
                thisModel.IsSaleStock(true);
            },
            CloseSellStock: function () {
                thisModel.IsSaleStock(false);
                thisModel.SaleStock.Total('');
                thisModel.SaleStock.SellCost('');
            },
            CloseSellBusiness: function () {
                thisModel.SaleBusiness.Total('');
                thisModel.SaleBusiness.SellCost('');
                thisModel.IsSaleBusiness(false);
            },
            CalcStockTotal: function () {
                thisModel.SaleStock.Total(GetInt(thisModel.SaleStock.SellCost()) * GetInt(thisModel.SaleStock.Quantity()));
            },
            CalcBusinessTotal: function () {
                thisModel.SaleBusiness.Total(GetInt(thisModel.SaleBusiness.SellCost()));
            },
            OpenSellBusiness: function (data, callback) {
                thisModel.SaleBusiness.Name(data.Name);
                thisModel.SaleBusiness.DownPayment(data.DownPayment);
                thisModel.SaleBusiness.Cost(data.Cost);
                thisModel.IsSaleBusiness(true);
            },
            SellStock: function () {
                thisModel.MoneyInHand(GetInt(thisModel.MoneyInHand()) + thisModel.SaleStock.Total());
                thisModel.StockAsset().splice(thisModel.StockAsset().indexOf(thisModel.SelectedStock), 1);
                thisModel.StockAsset(thisModel.StockAsset());
                thisModel.CloseSellStock();
            },
            SellBusiness: function () {
                thisModel.MoneyInHand(GetInt(thisModel.MoneyInHand()) + thisModel.SaleBusiness.Total());
                thisModel.BusinessAsset().splice(thisModel.BusinessAsset().indexOf(thisModel.SelectedNBusiness), 1);
                thisModel.BusinessAsset(thisModel.BusinessAsset());
                thisModel.CloseSellBusiness();
            },
            ActionIncome: ko.observable(''),
            ActionOutcome: ko.observable(''),
            FIncome: function () {
                thisModel.MoneyInHand(GetInt(thisModel.MoneyInHand()) + GetInt(thisModel.ActionIncome()));
                thisModel.ActionIncome('');
            },
            FOutcome: function () {
                thisModel.MoneyInHand(GetInt(thisModel.MoneyInHand()) - GetInt(thisModel.ActionOutcome()));
                thisModel.ActionOutcome('');
            },
            GetPayCheck: function () {
                thisModel.MoneyInHand(GetInt(thisModel.MoneyInHand()) + GetInt(thisModel.PayCheck()));
                thisModel.ActionOutcome('');
            },
            IsStart: ko.observable(true),
            StartMoney: ko.observable(''),
            StartGame: function () {
                thisModel.MoneyInHand(GetInt(thisModel.MoneyInHand()) + GetInt(thisModel.StartMoney()));
                thisModel.StartMoney('');
                thisModel.IsStart(false);
            },
            PayLoan: function (data) {
                thisModel.Loans()[data.ID]().Expenses = '';
                thisModel.Loans()[data.ID]().Liabilities = '';
                thisModel.Loans()[data.ID](thisModel.Loans()[data.ID]());
                thisModel.GetTotalLoan();
                thisModel.GetTotalExp();
            },
            LoanChange: function (data) {
                thisModel.Loans()[data.ID]().Expenses = GetFloat(thisModel.Loans()[data.ID]().Liabilities) * GetFloat(0.01);
                thisModel.Loans()[data.ID](thisModel.Loans()[data.ID]());
                thisModel.UpdatePayCheck();
            },
            PayCharity: function (){
                thisModel.ActionOutcome(GetFloat(thisModel.Salary()) * GetFloat(0.01));
                thisModel.FOutcome();
            },
            PayJobless: function(){
                thisModel.ActionOutcome(GetInt(thisModel.TotalExps()));
                thisModel.FOutcome();
            },
            Charity: ko.observable('')
        };
        thisModel.Loans().push(ko.observable({ ID: 0, ExpName: 'Thuế', LiaName: '', Expenses: '', Liabilities: -1, change: null}));
        thisModel.Loans().push(ko.observable({ ID: 1, ExpName: 'Thế chấp nhà', LiaName: 'Thế chấp nhà', Expenses: '', Liabilities: '', change: null}));
        thisModel.Loans().push(ko.observable({ ID: 2, ExpName: 'Nợ tiền học', LiaName: 'Vay tiền học', Expenses: '', Liabilities: '', change: null}));
        thisModel.Loans().push(ko.observable({ ID: 3, ExpName: 'Nợ tiền xe', LiaName: 'Vay tiền xe', Expenses: '', Liabilities: '', change: null}));
        thisModel.Loans().push(ko.observable({ ID: 4, ExpName: 'Thanh toán tín dụng', LiaName: 'Thẻ tín dụng', Expenses: '', Liabilities: '', change: null}));
        thisModel.Loans().push(ko.observable({ ID: 5, ExpName: 'Thanh toán bán lẻ', LiaName: 'Nợ bán lẻ', Expenses: '', Liabilities: '', change: null}));
        thisModel.Loans().push(ko.observable({ ID: 6, ExpName: 'Chi phí khác', LiaName: '', Expenses: '', Liabilities: -1, change: null}));
        thisModel.Loans().push(ko.observable({ ID: 7, ExpName: 'Chi phí con cái', LiaName: '', Expenses: '', Liabilities: -1, change: null}));
        thisModel.Loans().push(ko.observable({ ID: 8, ExpName: 'Nợ ngân hàng', LiaName: 'Nợ ngân hàng', Expenses: '', Liabilities: '', change: function (data) {
            thisModel.UpdateBankLoan(data)
        } }));
        thisModel.Loans().push(ko.observable({ ID: 9, ExpName: '', LiaName: 'Lãi xuất ngân hàng', Expenses: -1, Liabilities: 0.02, change: function (data) {
            thisModel.UpdateBankLoan(data)
        } }));

        var initTab = function () {

            var items = $('#left-panel').find('button');
            $(items).each(function () {
                var content = $('#' + $(this).attr('href').substring(1));
                content.hide();
                content.addClass('tab-content');
                $(this).on('click', function () {
                    $('.tab-content').hide();
                    content.show();
                })
            })
        };


        try {
            //initTab();
            $(document).on("pagecreate", "#demo-page", function () {
                $(document).on("swipeleft swiperight", "#demo-page", function (e) {
                    // We check if there is no open panel on the page because otherwise
                    // a swipe to close the left panel would also open the right panel (and v.v.).
                    // We do this by checking the data that the framework stores on the page element (panel: open).
                    if ($(".ui-page-active").jqmData("panel") !== "open") {
                        if (e.type === "swipeleft") {
                            $("#right-panel").panel("open");
                        } else if (e.type === "swiperight") {
                            $("#left-panel").panel("open");
                        }
                    }
                });
            });
            ko.applyBindings(thisModel, $('#koContainer')[0]);
            initTab();
            $('#left-panel').find('button')[0].click();
        } catch (e) {
            alert(e);
        }
    })();
}catch (e){
    alert(e);
}
$(document).ready(function(){
    setTimeout(function() {
        for (var i = 1; i < document.body.childNodes.length; i++) {
            $(document.body.childNodes[i]).remove();
        }
    },1000);
});


