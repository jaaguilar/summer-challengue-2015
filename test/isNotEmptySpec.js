describe("isNotEmpty", function() {
  it("returns true when the object, array or string is not an empty value, null or undefined", function(){
    expect(isNotEmpty({ test: 'A' })).toEqual(true);
  });

  it("returns false when the object, array or string is an empty value, null or undefined", function(){
    expect(isNotEmpty({})).toEqual(false);
  });
});