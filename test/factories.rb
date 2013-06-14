FactoryGirl.define do
  factory :quiz do
    name    'AQuiz'
    summary 'SomeSummary'
  end

  factory :question do
    quiz
    answer  'This is true'
    data    '{"type":"Multiple choice","question":"Q2","options":[{"value":"This is false"},{"value":"This is true!"}]}'
  end
end